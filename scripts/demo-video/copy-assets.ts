import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { outputDirFor } from "../../demo-videos/capture/types";

const id = firstInput(process.argv.slice(2));

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

export async function copyAssets(walkthroughId = id) {
  const sourceDir = outputDirFor(walkthroughId);
  const publicDir = path.resolve(process.cwd(), "public", "videos", walkthroughId);
  await rm(publicDir, { recursive: true, force: true });
  await mkdir(publicDir, { recursive: true });

  const files = await readdir(sourceDir).catch(() => {
    throw new Error(`Missing ${path.relative(process.cwd(), sourceDir)}. Run the capture pipeline first.`);
  });

  const copyable = files.filter(
    (file) =>
      [
        "capture.webm",
        "walkthrough.json",
        "callouts.json",
        "captions.json",
        "voiceover.json",
        "voiceover.mp3",
        "voiceover.wav",
        "voiceover.m4a",
      ].includes(file) || /^voiceover-[a-z0-9-]+\.(mp3|m4a|wav)$/.test(file),
  );

  for (const file of copyable) {
    await copyFile(path.join(sourceDir, file), path.join(publicDir, file));
  }

  return { publicDir, copied: copyable };
}

async function main() {
  const result = await copyAssets(id);
  console.log(`Copied ${result.copied.length} file(s) to ${path.relative(process.cwd(), result.publicDir)}`);
}

function firstInput(argv: string[]) {
  return argv.find((arg) => arg !== "--" && !arg.startsWith("-")) ?? "cost-walkthrough";
}
