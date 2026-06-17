import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright";
import {
  type CalloutMetadata,
  type CapturedScene,
  type Step,
  defaultWalkthroughPath,
  loadWalkthrough,
  outputDirFor,
  secondsToFrame,
} from "./types";

const FPS = 30;
const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

async function main() {
  const walkthroughPath = defaultWalkthroughPath(args.walkthrough);
  const walkthrough = await loadWalkthrough(walkthroughPath);
  const outputDir = outputDirFor(walkthrough.id);
  await mkdir(outputDir, { recursive: true });
  await cleanCaptureArtifacts(outputDir);

  console.log(`Recording ${walkthrough.id} from ${walkthrough.url}`);

  const browser = await chromium.launch({ headless: !args.headed });
  const context = await newContext(browser, walkthrough, outputDir);
  const page = await context.newPage();
  const callouts: CalloutMetadata[] = [];
  const capturedScenes: CapturedScene[] = [];
  const startedAt = Date.now();
  const voiceoverDurations = await loadVoiceoverDurations(outputDir);

  try {
    for (const scene of walkthrough.scenes) {
      const sceneStart = elapsedSeconds(startedAt);
      console.log(`- ${scene.id}`);

      if (scene.type === "title") {
        await page.goto("about:blank");
        await waitSeconds(scene.duration);
      } else {
        if (scene.path) {
          await page.goto(new URL(scene.path, normalizedBaseUrl(walkthrough.url)).toString(), {
            waitUntil: "domcontentloaded",
          });
        }
        for (let index = 0; index < (scene.steps ?? []).length; index += 1) {
          await runStep(page, scene.steps?.[index] as Step, scene.id, index, startedAt, callouts);
        }
      }

      const minimumDuration = voiceoverDurations.get(scene.id);
      if (minimumDuration) {
        const sceneDuration = elapsedSeconds(startedAt) - sceneStart;
        const remaining = minimumDuration + 0.75 - sceneDuration;
        if (remaining > 0) await waitSeconds(remaining);
      }

      const sceneEnd = elapsedSeconds(startedAt);
      capturedScenes.push({
        ...scene,
        start: sceneStart,
        end: sceneEnd,
        startFrame: secondsToFrame(sceneStart, FPS),
        endFrame: secondsToFrame(sceneEnd, FPS),
      });
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const video = page.video();
  if (!video) throw new Error("Playwright did not produce a video file");
  const videoPath = await video.path();
  const captureFile = path.join(outputDir, "capture.webm");
  await rename(videoPath, captureFile);

  const normalized = {
    ...walkthrough,
    fps: FPS,
    capturedAt: new Date().toISOString(),
    capturedBaseUrl: walkthrough.url,
    capturedViewport: walkthrough.viewport,
    videoFile: "capture.webm",
    scenes: capturedScenes,
  };

  await writeFile(path.join(outputDir, "walkthrough.json"), `${JSON.stringify(normalized, null, 2)}\n`);
  await writeFile(path.join(outputDir, "callouts.json"), `${JSON.stringify(callouts, null, 2)}\n`);

  console.log(`Wrote ${path.relative(process.cwd(), captureFile)}`);
  console.log(`Wrote ${path.relative(process.cwd(), path.join(outputDir, "callouts.json"))}`);
}

async function newContext(browser: Awaited<ReturnType<typeof chromium.launch>>, walkthrough: Awaited<ReturnType<typeof loadWalkthrough>>, outputDir: string): Promise<BrowserContext> {
  const contextOptions = {
    viewport: {
      width: walkthrough.viewport.width,
      height: walkthrough.viewport.height,
    },
    deviceScaleFactor: walkthrough.viewport.deviceScaleFactor ?? 1,
    recordVideo: {
      dir: outputDir,
      size: {
        width: walkthrough.viewport.width,
        height: walkthrough.viewport.height,
      },
    },
    storageState:
      walkthrough.auth?.mode === "storageState" && walkthrough.auth.storageState
        ? walkthrough.auth.storageState
        : undefined,
  };
  return browser.newContext(contextOptions);
}

async function runStep(
  page: Page,
  step: Step,
  sceneId: string,
  index: number,
  startedAt: number,
  callouts: CalloutMetadata[],
) {
  if ("waitFor" in step) {
    await page.locator(step.waitFor).waitFor({ state: "visible", timeout: step.timeoutMs ?? 10000 });
    return;
  }

  if ("click" in step) {
    await page.locator(step.click).click();
    return;
  }

  if ("fill" in step) {
    await page.locator(step.fill).fill(step.value);
    return;
  }

  if ("press" in step) {
    await page.locator(step.press).press(step.key);
    return;
  }

  if ("pause" in step) {
    await waitSeconds(step.pause);
    return;
  }

  const locator = page.locator(step.spotlight);
  await locator.waitFor({ state: "visible", timeout: 10000 });
  const box = await locator.boundingBox();
  if (!box) throw new Error(`Selector is visible but has no bounding box: ${step.spotlight}`);

  const start = elapsedSeconds(startedAt);
  const duration = step.duration ?? 2.5;
  callouts.push({
    id: `${sceneId}-${index}`,
    sceneId,
    selector: step.spotlight,
    label: step.label,
    start,
    end: start + duration,
    startFrame: secondsToFrame(start, FPS),
    endFrame: secondsToFrame(start + duration, FPS),
    box,
  });
}

function parseArgs(argv: string[]) {
  const parsed = {
    walkthrough: "cost-walkthrough",
    headed: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    else if (arg === "--headed") parsed.headed = true;
    else if (arg === "--walkthrough") parsed.walkthrough = requiredValue(argv, ++index, arg);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      parsed.walkthrough = arg;
    }
  }

  return parsed;
}

function requiredValue(argv: string[], index: number, flag: string) {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

function printHelp() {
  console.log(`Usage:
  pnpm video:capture -- demo-videos/walkthroughs/cost-walkthrough.yaml
  DEMO_BASE_URL=http://localhost:5173 pnpm video:capture -- cost-walkthrough

Options:
  --walkthrough <id|path>  Walkthrough id or YAML path.
  --headed                 Show Chromium while recording.
`);
}

function normalizedBaseUrl(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

function elapsedSeconds(startedAt: number) {
  return (Date.now() - startedAt) / 1000;
}

function waitSeconds(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function cleanCaptureArtifacts(outputDir: string) {
  const files = await readdir(outputDir).catch(() => []);
  await Promise.all(
    files
      .filter((file) => file === "capture.webm" || file === "walkthrough.json" || file === "callouts.json" || /^page@.*\.webm$/.test(file))
      .map((file) => rm(path.join(outputDir, file), { force: true })),
  );
}

async function loadVoiceoverDurations(outputDir: string) {
  const raw = await readFile(path.join(outputDir, "voiceover.json"), "utf8").catch(() => "");
  const manifest = raw
    ? (JSON.parse(raw) as {
        files?: Array<{ sceneId?: string; duration?: number }>;
      })
    : null;
  const durations = new Map<string, number>();
  for (const file of manifest?.files ?? []) {
    if (file.sceneId && typeof file.duration === "number" && Number.isFinite(file.duration) && file.duration > 0) {
      durations.set(file.sceneId, file.duration);
    }
  }
  return durations;
}
