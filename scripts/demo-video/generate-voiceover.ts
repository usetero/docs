import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import {
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

  const scriptPath = path.join(outputDir, "script.txt");
  const script = await readFile(scriptPath, "utf8").catch(() => {
    throw new Error(`Missing ${path.relative(process.cwd(), scriptPath)}. Run pnpm video:extract first.`);
  });
  const scenes = await readNarrationScenes(outputDir);

  const provider = process.env.DEMO_VIDEO_TTS_PROVIDER;
  const shouldTryMacOsSpeech =
    provider === "macos" || (!process.env.OPENAI_API_KEY && provider !== "placeholder" && process.platform === "darwin");

  if (provider === "chatterbox") {
    if (!scenes.length) {
      throw new Error("Chatterbox voiceover requires narration-scenes.json. Run pnpm video:extract first.");
    }
    const manifestPath = await generateChatterboxSceneSpeech(outputDir);
    console.log(`Wrote ${path.relative(process.cwd(), manifestPath)}`);
    return;
  }

  if (shouldTryMacOsSpeech) {
    const localPath = scenes.length
      ? await generateMacOsSceneSpeech(scenes, outputDir)
      : await generateMacOsSpeech(script, outputDir);
    if (localPath) {
      console.log(`Wrote ${path.relative(process.cwd(), localPath)}`);
      return;
    }
    if (provider === "macos") {
      throw new Error("macOS speech tools were unavailable or produced no audio.");
    }
    console.warn("macOS speech tools were unavailable or produced no audio. Falling back to placeholder audio.");
  }

  if (process.env.OPENAI_API_KEY) {
    if (scenes.length) await generateOpenAiSceneSpeech(walkthrough, scenes, outputDir);
    else await generateOpenAiSpeech(walkthrough, script, outputDir);
    return;
  }

  const duration = await durationFromCapture(outputDir, walkthrough.durationTargetSeconds ?? 75);
  const outputPath = path.join(outputDir, "voiceover.wav");
  await writeFile(outputPath, createSilentWav(duration));
  await writeFile(
    path.join(outputDir, "voiceover-note.txt"),
    [
      "OPENAI_API_KEY is not set, so this is deterministic placeholder silence.",
      "Set OPENAI_API_KEY and rerun pnpm video:voice to generate narrated audio.",
      "",
    ].join("\n"),
  );
  console.warn("OPENAI_API_KEY is not set. Wrote placeholder voiceover.wav.");
}

type NarrationScene = {
  sceneId: string;
  text: string;
};

type VoiceoverManifest = {
  mode: "scene";
  files: Array<{
    sceneId: string;
    file: string;
    duration: number;
  }>;
};

async function readNarrationScenes(outputDir: string): Promise<NarrationScene[]> {
  const file = path.join(outputDir, "narration-scenes.json");
  const raw = await readFile(file, "utf8").catch(() => "");
  if (!raw) return [];
  return JSON.parse(raw) as NarrationScene[];
}

async function generateOpenAiSpeech(
  walkthrough: Awaited<ReturnType<typeof loadWalkthrough>>,
  script: string,
  outputDir: string,
) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
      voice: walkthrough.voice?.voice ?? "alloy",
      input: script,
      format: "mp3",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI speech request failed (${response.status}): ${text}`);
  }

  const outputPath = path.join(outputDir, "voiceover.mp3");
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}

async function generateOpenAiSceneSpeech(
  walkthrough: Awaited<ReturnType<typeof loadWalkthrough>>,
  scenes: NarrationScene[],
  outputDir: string,
) {
  const files: VoiceoverManifest["files"] = [];
  for (const scene of scenes) {
    const file = `voiceover-${safeFilePart(scene.sceneId)}.mp3`;
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
        voice: walkthrough.voice?.voice ?? "alloy",
        input: scene.text,
        format: "mp3",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI speech request failed (${response.status}) for ${scene.sceneId}: ${text}`);
    }

    const outputPath = path.join(outputDir, file);
    await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
    files.push({ sceneId: scene.sceneId, file, duration: await audioDurationSeconds(outputPath) });
  }

  const manifestPath = await writeVoiceoverManifest(outputDir, files);
  console.log(`Wrote ${path.relative(process.cwd(), manifestPath)}`);
}

async function generateMacOsSpeech(script: string, outputDir: string) {
  const say = await findExecutable("say");
  if (!say) return null;

  const wavPath = path.join(outputDir, "voiceover.wav");
  await run(say, ["-o", wavPath, "--data-format=LEI16@22050", script]).catch(() => null);
  const result = await stat(wavPath).catch(() => null);
  return result && result.size > 4096 ? wavPath : null;
}

async function generateMacOsSceneSpeech(scenes: NarrationScene[], outputDir: string) {
  const say = await findExecutable("say");
  if (!say) return null;

  const files: VoiceoverManifest["files"] = [];
  for (const scene of scenes) {
    const file = `voiceover-${safeFilePart(scene.sceneId)}.wav`;
    const wavPath = path.join(outputDir, file);
    await run(say, ["-o", wavPath, "--data-format=LEI16@22050", scene.text]).catch(() => null);
    const result = await stat(wavPath).catch(() => null);
    if (!result || result.size <= 4096) return null;
    files.push({ sceneId: scene.sceneId, file, duration: await audioDurationSeconds(wavPath) });
  }

  return writeVoiceoverManifest(outputDir, files);
}

async function generateChatterboxSceneSpeech(outputDir: string) {
  const audioPrompt = process.env.DEMO_VIDEO_CHATTERBOX_AUDIO_PROMPT ?? (await createChatterboxMacOsAudioPrompt(outputDir));
  const localPython = path.join(process.cwd(), "demo-videos/.venv-chatterbox/bin/python");
  const python =
    process.env.DEMO_VIDEO_CHATTERBOX_PYTHON ??
    (await findExecutableAt(localPython)) ??
    (await findExecutable("python3")) ??
    (await findExecutable("python"));
  if (!python) {
    throw new Error(
      "Unable to find Python. Run pnpm video:install-chatterbox or set DEMO_VIDEO_CHATTERBOX_PYTHON to a Python with chatterbox-tts installed.",
    );
  }

  const args = [
    path.join(process.cwd(), "scripts/demo-video/chatterbox_voiceover.py"),
    "--input",
    path.join(outputDir, "narration-scenes.json"),
    "--output-dir",
    outputDir,
  ];

  addOptionalArg(args, "--model", process.env.DEMO_VIDEO_CHATTERBOX_MODEL);
  addOptionalArg(args, "--device", process.env.DEMO_VIDEO_CHATTERBOX_DEVICE);
  addOptionalArg(args, "--audio-prompt", audioPrompt);
  addOptionalArg(args, "--language-id", process.env.DEMO_VIDEO_CHATTERBOX_LANGUAGE_ID);
  addOptionalArg(args, "--exaggeration", process.env.DEMO_VIDEO_CHATTERBOX_EXAGGERATION);
  addOptionalArg(args, "--cfg-weight", process.env.DEMO_VIDEO_CHATTERBOX_CFG_WEIGHT);
  addOptionalArg(args, "--temperature", process.env.DEMO_VIDEO_CHATTERBOX_TEMPERATURE);

  await runStreaming(python, args);
  return path.join(outputDir, "voiceover.json");
}

async function createChatterboxMacOsAudioPrompt(outputDir: string) {
  if (process.env.DEMO_VIDEO_CHATTERBOX_DISABLE_MACOS_PROMPT === "1") return undefined;
  if (process.platform !== "darwin") return undefined;

  const say = await findExecutable("say");
  if (!say) return undefined;

  const voice = process.env.DEMO_VIDEO_CHATTERBOX_MACOS_VOICE ?? "Samantha";
  const outputPath = path.join(outputDir, "chatterbox-reference.wav");
  const text = [
    "Hi, I'm Sarah from Tero.",
    "In this walkthrough, I'll show how platform teams turn cloud cost signals into prioritized engineering work.",
    "The goal is a clear, professional product demo voice with steady pacing and practical detail.",
  ].join(" ");

  await run(say, ["-v", voice, "-o", outputPath, "--data-format=LEI16@22050", text]);
  const result = await stat(outputPath).catch(() => null);
  if (!result || result.size <= 4096) {
    throw new Error(`macOS voice ${voice} did not produce a usable Chatterbox audio prompt.`);
  }

  console.log(`Using macOS voice ${voice} as Chatterbox audio prompt: ${path.relative(process.cwd(), outputPath)}`);
  return outputPath;
}

async function writeVoiceoverManifest(outputDir: string, files: VoiceoverManifest["files"]) {
  const outputPath = path.join(outputDir, "voiceover.json");
  await writeFile(outputPath, `${JSON.stringify({ mode: "scene", files }, null, 2)}\n`);
  return outputPath;
}

async function durationFromCapture(outputDir: string, fallback: number) {
  const walkthroughPath = path.join(outputDir, "walkthrough.json");
  const raw = await readFile(walkthroughPath, "utf8").catch(() => "");
  if (!raw) return fallback;

  const captured = JSON.parse(raw) as CapturedWalkthrough;
  const lastScene = captured.scenes.at(-1);
  return Math.max(lastScene?.end ?? fallback, 1);
}

function createSilentWav(durationSeconds: number) {
  const sampleRate = 44100;
  const channels = 1;
  const bitsPerSample = 16;
  const sampleCount = Math.ceil(durationSeconds * sampleRate);
  const dataSize = sampleCount * channels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

async function findExecutable(name: string) {
  const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  for (const entry of pathEntries) {
    const candidate = path.join(entry, name);
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next PATH entry.
    }
  }
  return null;
}

async function findExecutableAt(candidate: string) {
  try {
    await access(candidate, constants.X_OK);
    return candidate;
  } catch {
    return null;
  }
}

function safeFilePart(value: string) {
  return value.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function addOptionalArg(args: string[], name: string, value: string | undefined) {
  if (value) args.push(name, value);
}

async function audioDurationSeconds(file: string) {
  const ffprobe = await findExecutable("ffprobe");
  if (ffprobe) {
    const output = await runForOutput(ffprobe, [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      file,
    ]);
    const duration = Number.parseFloat(output.trim());
    if (Number.isFinite(duration) && duration > 0) return duration;
  }

  return wavDurationSeconds(file);
}

async function wavDurationSeconds(file: string) {
  const buffer = await readFile(file);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`Unable to determine audio duration for ${file}`);
  }

  const byteRate = buffer.readUInt32LE(28);
  const dataIndex = buffer.indexOf("data", 12, "ascii");
  if (byteRate <= 0 || dataIndex === -1) throw new Error(`Unable to determine WAV duration for ${file}`);
  const dataSize = buffer.readUInt32LE(dataIndex + 4);
  return dataSize / byteRate;
}

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed with exit code ${code}`));
    });
  });
}

function runStreaming(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed with exit code ${code}`));
    });
  });
}

function runForOutput(command: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(Buffer.concat(stdout).toString("utf8"));
      else reject(new Error(`${command} failed with exit code ${code}: ${Buffer.concat(stderr).toString("utf8")}`));
    });
  });
}

function firstInput(argv: string[]) {
  return argv.find((arg) => arg !== "--" && !arg.startsWith("-")) ?? "cost-walkthrough";
}
