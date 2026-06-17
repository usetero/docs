import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
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
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const narrationScenes = walkthrough.scenes
    .filter((scene) => scene.voiceover !== false && scene.narration.trim())
    .map((scene) => ({
      sceneId: scene.id,
      text: scene.narration,
    }));
  const script = narrationScenes.map((scene) => scene.text).join("\n\n");

  await writeFile(path.join(outputDir, "script.txt"), `${script}\n`);
  await writeFile(
    path.join(outputDir, "narration-scenes.json"),
    `${JSON.stringify(narrationScenes, null, 2)}\n`,
  );

  console.log(`Wrote ${path.relative(process.cwd(), path.join(outputDir, "script.txt"))}`);
  console.log(`Wrote ${path.relative(process.cwd(), path.join(outputDir, "narration-scenes.json"))}`);
}

function firstInput(argv: string[]) {
  return argv.find((arg) => arg !== "--" && !arg.startsWith("-")) ?? "cost-walkthrough";
}
