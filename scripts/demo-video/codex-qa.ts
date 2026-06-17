import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { defaultWalkthroughPath, outputDirFor } from "../../demo-videos/capture/types";

const input = firstInput(process.argv.slice(2));

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

async function main() {
  const id = input.endsWith(".yaml") || input.endsWith(".yml") ? path.basename(input, path.extname(input)) : input;
  const yamlPath = path.resolve(process.cwd(), defaultWalkthroughPath(input));
  const outputDir = outputDirFor(id);
  const reportPath = path.join(outputDir, "codex-qa.md");

  const context = await readQaContext(yamlPath, outputDir);
  const prompt = [
    "You are reviewing a deterministic docs walkthrough video pipeline.",
    "Do not suggest replacing scripted Playwright capture with live agent clicks.",
    "Find selector risks, narration/caption issues, timing problems, and docs-readiness gaps.",
    "Return concise findings with file/artifact references and practical fixes.",
    "",
    context,
  ].join("\n");

  await runCodex(prompt, reportPath);
  console.log(`Wrote ${path.relative(process.cwd(), reportPath)}`);
}

async function readQaContext(yamlPath: string, outputDir: string) {
  const files = [
    yamlPath,
    path.join(outputDir, "walkthrough.json"),
    path.join(outputDir, "callouts.json"),
    path.join(outputDir, "captions.json"),
    path.join(outputDir, "voiceover-note.txt"),
  ];

  const blocks = [];
  for (const file of files) {
    const text = await readFile(file, "utf8").catch(() => "");
    if (!text) continue;
    blocks.push(`--- ${path.relative(process.cwd(), file)} ---\n${text.slice(0, 12000)}`);
  }
  return blocks.join("\n\n");
}

function runCodex(prompt: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const model = process.env.CODEX_MODEL ?? "gpt-5.4-mini";
    const child = spawn(
      "codex",
      [
        "exec",
        "--model",
        model,
        "--ephemeral",
        "--ignore-user-config",
        "-c",
        `service_tier="${process.env.CODEX_SERVICE_TIER ?? "fast"}"`,
        "--sandbox",
        "read-only",
        "--output-last-message",
        outputPath,
        prompt,
      ],
      { stdio: "inherit" },
    );
    child.on("error", async (error) => {
      await writeFile(
        outputPath,
        [
          "# Codex QA did not run",
          "",
          `The Codex CLI command failed to start: ${error.message}`,
          "",
          "Run `codex login` locally, then retry `pnpm video:codex:qa -- cost-walkthrough`.",
          "",
        ].join("\n"),
      );
      reject(error);
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`codex exec failed with exit code ${code}`));
    });
  });
}

function firstInput(argv: string[]) {
  return argv.find((arg) => arg !== "--" && !arg.startsWith("-")) ?? "cost-walkthrough";
}
