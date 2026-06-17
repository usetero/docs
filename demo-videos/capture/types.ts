import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { supportedStepKeys } from "./selectors";

export type VoiceSettings = {
  provider: "openai" | "placeholder" | string;
  voice?: string;
  tone?: string;
};

export type ViewportSettings = {
  width: number;
  height: number;
  deviceScaleFactor?: number;
};

export type AuthSettings = {
  mode: "none" | "storageState" | string;
  storageState?: string | null;
};

export type WaitForStep = { waitFor: string; timeoutMs?: number };
export type ClickStep = { click: string };
export type SpotlightStep = { spotlight: string; label?: string; duration?: number };
export type PauseStep = { pause: number };
export type FillStep = { fill: string; value: string };
export type PressStep = { press: string; key: string };

export type Step =
  | WaitForStep
  | ClickStep
  | SpotlightStep
  | PauseStep
  | FillStep
  | PressStep;

export type BaseScene = {
  id: string;
  title?: string;
  narration: string;
  voiceover?: boolean;
};

export type TitleScene = BaseScene & {
  type: "title";
  duration: number;
};

export type BrowserScene = BaseScene & {
  type: "browser";
  path?: string;
  duration?: number;
  steps?: Step[];
};

export type Scene = TitleScene | BrowserScene;

export type Walkthrough = {
  id: string;
  title: string;
  url: string;
  durationTargetSeconds?: number;
  persona?: string;
  goal?: string;
  voice?: VoiceSettings;
  viewport: ViewportSettings;
  auth?: AuthSettings;
  scenes: Scene[];
  sourcePath?: string;
};

export type CalloutMetadata = {
  id: string;
  sceneId: string;
  selector: string;
  label?: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type CaptionMetadata = {
  start: number;
  end: number;
  text: string;
  sceneId: string;
};

export type CapturedScene = Scene & {
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
};

export type CapturedWalkthrough = Omit<Walkthrough, "scenes"> & {
  fps: number;
  capturedAt: string;
  capturedBaseUrl: string;
  capturedViewport: ViewportSettings;
  videoFile?: string;
  scenes: CapturedScene[];
};

const supportedStepKeySet = new Set<string>(supportedStepKeys);

export async function loadWalkthrough(filePath: string): Promise<Walkthrough> {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const raw = await readFile(absolutePath, "utf8");
  const parsed = parse(raw);
  const walkthrough = validateWalkthrough(parsed, absolutePath);
  walkthrough.url = normalizeLocalhostUrl(resolveEnvTemplate(walkthrough.url));
  walkthrough.sourcePath = absolutePath;
  return walkthrough;
}

export function outputDirFor(id: string) {
  return path.resolve(process.cwd(), "demo-videos", "output", id);
}

export function defaultWalkthroughPath(id: string) {
  if (id.endsWith(".yaml") || id.endsWith(".yml")) return id;
  return path.join("demo-videos", "walkthroughs", `${id}.yaml`);
}

export function secondsToFrame(seconds: number, fps = 30) {
  return Math.max(0, Math.round(seconds * fps));
}

function validateWalkthrough(value: unknown, sourcePath: string): Walkthrough {
  const object = expectObject(value, "walkthrough");

  const walkthrough: Walkthrough = {
    id: expectString(object.id, "id"),
    title: expectString(object.title, "title"),
    url: expectString(object.url, "url"),
    durationTargetSeconds:
      object.durationTargetSeconds === undefined
        ? undefined
        : expectPositiveNumber(object.durationTargetSeconds, "durationTargetSeconds"),
    persona: optionalString(object.persona, "persona"),
    goal: optionalString(object.goal, "goal"),
    voice: validateVoice(object.voice),
    viewport: validateViewport(object.viewport),
    auth: validateAuth(object.auth),
    scenes: validateScenes(object.scenes),
    sourcePath,
  };

  if (walkthrough.scenes.length === 0) {
    throw new Error(`${sourcePath}: scenes must include at least one scene`);
  }

  return walkthrough;
}

function validateVoice(value: unknown): VoiceSettings | undefined {
  if (value === undefined || value === null) return undefined;
  const object = expectObject(value, "voice");
  return {
    provider: expectString(object.provider, "voice.provider"),
    voice: optionalString(object.voice, "voice.voice"),
    tone: optionalString(object.tone, "voice.tone"),
  };
}

function validateViewport(value: unknown): ViewportSettings {
  const object = expectObject(value, "viewport");
  return {
    width: expectPositiveInteger(object.width, "viewport.width"),
    height: expectPositiveInteger(object.height, "viewport.height"),
    deviceScaleFactor:
      object.deviceScaleFactor === undefined
        ? 1
        : expectPositiveNumber(object.deviceScaleFactor, "viewport.deviceScaleFactor"),
  };
}

function validateAuth(value: unknown): AuthSettings | undefined {
  if (value === undefined || value === null) return undefined;
  const object = expectObject(value, "auth");
  return {
    mode: expectString(object.mode, "auth.mode"),
    storageState:
      object.storageState === undefined || object.storageState === null
        ? null
        : expectString(object.storageState, "auth.storageState"),
  };
}

function validateScenes(value: unknown): Scene[] {
  if (!Array.isArray(value)) throw new Error("scenes must be a list");
  return value.map((scene, index) => validateScene(scene, `scenes[${index}]`));
}

function validateScene(value: unknown, name: string): Scene {
  const object = expectObject(value, name);
  const type = expectString(object.type, `${name}.type`);
  const base = {
    id: expectString(object.id, `${name}.id`),
    title: optionalString(object.title, `${name}.title`),
    narration: normalizeWhitespace(expectString(object.narration, `${name}.narration`)),
    voiceover:
      object.voiceover === undefined ? undefined : expectBoolean(object.voiceover, `${name}.voiceover`),
  };

  if (type === "title") {
    return {
      ...base,
      type,
      duration: expectPositiveNumber(object.duration, `${name}.duration`),
    };
  }

  if (type === "browser") {
    return {
      ...base,
      type,
      path: optionalString(object.path, `${name}.path`),
      duration:
        object.duration === undefined
          ? undefined
          : expectPositiveNumber(object.duration, `${name}.duration`),
      steps: validateSteps(object.steps, `${name}.steps`),
    };
  }

  throw new Error(`${name}.type must be "title" or "browser"`);
}

function validateSteps(value: unknown, name: string): Step[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`${name} must be a list`);

  return value.map((step, index) => {
    const object = expectObject(step, `${name}[${index}]`);
    const keys = Object.keys(object).filter((key) => object[key] !== undefined);
    const stepKeys = keys.filter((key) => supportedStepKeySet.has(key));
    if (stepKeys.length !== 1) {
      throw new Error(
        `${name}[${index}] must contain exactly one supported step key: ${supportedStepKeys.join(", ")}`,
      );
    }

    const key = stepKeys[0];
    if (key === "waitFor") {
      return {
        waitFor: expectString(object.waitFor, `${name}[${index}].waitFor`),
        timeoutMs:
          object.timeoutMs === undefined
            ? undefined
            : expectPositiveInteger(object.timeoutMs, `${name}[${index}].timeoutMs`),
      };
    }
    if (key === "click") return { click: expectString(object.click, `${name}[${index}].click`) };
    if (key === "spotlight") {
      return {
        spotlight: expectString(object.spotlight, `${name}[${index}].spotlight`),
        label: optionalString(object.label, `${name}[${index}].label`),
        duration:
          object.duration === undefined
            ? undefined
            : expectPositiveNumber(object.duration, `${name}[${index}].duration`),
      };
    }
    if (key === "pause") return { pause: expectPositiveNumber(object.pause, `${name}[${index}].pause`) };
    if (key === "fill") {
      return {
        fill: expectString(object.fill, `${name}[${index}].fill`),
        value: expectString(object.value, `${name}[${index}].value`),
      };
    }
    return {
      press: expectString(object.press, `${name}[${index}].press`),
      key: expectString(object.key, `${name}[${index}].key`),
    };
  });
}

function resolveEnvTemplate(value: string) {
  return value.replace(/\$\{([A-Z0-9_]+)(?::-([^}]+))?\}/g, (_, name: string, fallback = "") => {
    return process.env[name] || fallback;
  });
}

function normalizeLocalhostUrl(value: string) {
  const url = new URL(value);
  if (url.hostname === "localhost") {
    url.hostname = "127.0.0.1";
  }
  return url.toString().replace(/\/$/, "");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function expectObject(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as Record<string, unknown>;
}

function expectString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(value: unknown, name: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return expectString(value, name);
}

function expectBoolean(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${name} must be a boolean`);
  return value;
}

function expectPositiveInteger(value: unknown, name: string): number {
  const number = expectPositiveNumber(value, name);
  if (!Number.isInteger(number)) throw new Error(`${name} must be an integer`);
  return number;
}

function expectPositiveNumber(value: unknown, name: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return value;
}
