import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { copyAssets } from "./copy-assets";

const id = firstInput(process.argv.slice(2));

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

async function main() {
  const { copied } = await copyAssets(id);
  const publicVideos = path.resolve(process.cwd(), "public", "videos");
  await mkdir(publicVideos, { recursive: true });

  const audioFile = copied.includes("voiceover.mp3")
    ? "voiceover.mp3"
    : copied.includes("voiceover.m4a")
      ? "voiceover.m4a"
      : "voiceover.wav";
  const durationInFrames = await durationInFramesFor(id);
  const props = JSON.stringify({ id, audioFile, durationInFrames });
  const entry = path.join("demo-videos", "remotion", "src", "Root.tsx");
  const videoOutput = path.join("public", "videos", `${id}.mp4`);
  const posterOutput = path.join("public", "videos", `${id}-poster.png`);
  await rm(videoOutput, { force: true });
  await rm(posterOutput, { force: true });

  await run("pnpm", [
    "exec",
    "remotion",
    "render",
    entry,
    "Walkthrough",
    videoOutput,
    "--props",
    props,
    "--overwrite",
    "--codec",
    "h264",
    "--audio-codec",
    "aac",
  ]);

  await run("pnpm", [
    "exec",
    "remotion",
    "still",
    entry,
    "Walkthrough",
    posterOutput,
    "--props",
    props,
    "--frame",
    "30",
    "--overwrite",
  ]);

  console.log(`Wrote ${videoOutput}`);
  console.log(`Wrote ${posterOutput}`);
}

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

function firstInput(argv: string[]) {
  return argv.find((arg) => arg !== "--" && !arg.startsWith("-")) ?? "cost-walkthrough";
}

async function durationInFramesFor(id: string) {
  const walkthroughPath = path.resolve(process.cwd(), "demo-videos", "output", id, "walkthrough.json");
  const raw = await readFile(walkthroughPath, "utf8").catch(() => "");
  if (!raw) return 75 * 30;

  const walkthrough = JSON.parse(raw) as { fps?: number; scenes?: Array<{ end?: number }> };
  const fps = walkthrough.fps ?? 30;
  const lastSceneEnd = walkthrough.scenes?.reduce((max, scene) => Math.max(max, scene.end ?? 0), 0) ?? 0;
  return Math.max(Math.ceil((lastSceneEnd + 1) * fps), fps);
}
