import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type CaptionMetadata,
  type CapturedWalkthrough,
  defaultWalkthroughPath,
  loadWalkthrough,
  outputDirFor,
} from "../../demo-videos/capture/types";

const input = firstInput(process.argv.slice(2));

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

async function main() {
  const walkthrough = await loadWalkthrough(defaultWalkthroughPath(input));
  const outputDir = outputDirFor(walkthrough.id);
  await mkdir(outputDir, { recursive: true });

  const captured = await readCapturedWalkthrough(outputDir);
  const captions = captured
    ? captured.scenes
        .filter((scene) => scene.voiceover !== false && scene.narration.trim())
        .map((scene) => ({
          start: scene.start,
          end: scene.end,
          text: scene.narration,
          sceneId: scene.id,
        }))
    : fallbackCaptions(walkthrough);

  const outputPath = path.join(outputDir, "captions.json");
  await writeFile(outputPath, `${JSON.stringify(captions, null, 2)}\n`);
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}

async function readCapturedWalkthrough(outputDir: string) {
  const file = path.join(outputDir, "walkthrough.json");
  const raw = await readFile(file, "utf8").catch(() => "");
  return raw ? (JSON.parse(raw) as CapturedWalkthrough) : null;
}

function fallbackCaptions(walkthrough: Awaited<ReturnType<typeof loadWalkthrough>>): CaptionMetadata[] {
  const targetDuration = walkthrough.durationTargetSeconds ?? 75;
  const fixedDuration = walkthrough.scenes.reduce((total, scene) => {
    return total + ("duration" in scene && scene.duration ? scene.duration : 0);
  }, 0);
  const flexibleScenes = walkthrough.scenes.filter((scene) => !("duration" in scene) || !scene.duration);
  const fallbackSceneDuration = Math.max(
    (targetDuration - fixedDuration) / Math.max(flexibleScenes.length, 1),
    1,
  );
  let cursor = 0;

  return walkthrough.scenes.flatMap((scene) => {
    const duration = "duration" in scene && scene.duration ? scene.duration : fallbackSceneDuration;
    if (scene.voiceover === false || !scene.narration.trim()) {
      cursor += duration;
      return [];
    }

    const caption = {
      start: cursor,
      end: cursor + duration,
      text: scene.narration,
      sceneId: scene.id,
    };
    cursor += duration;
    return [caption];
  });
}

function firstInput(argv: string[]) {
  return argv.find((arg) => arg !== "--" && !arg.startsWith("-")) ?? "cost-walkthrough";
}
