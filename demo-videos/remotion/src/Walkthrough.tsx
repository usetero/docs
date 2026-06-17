import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { BrowserVideo } from "./components/BrowserVideo";
import { BrandBug } from "./components/BrandBug";
import { Callouts } from "./components/Callouts";
import { Captions } from "./components/Captions";
import { TitleCard } from "./components/TitleCard";

type Box = { x: number; y: number; width: number; height: number };

type CapturedScene = {
  id: string;
  title?: string;
  type: "title" | "browser";
  narration: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
};

export type WalkthroughData = {
  id: string;
  title: string;
  capturedViewport?: { width: number; height: number };
  scenes: CapturedScene[];
};

export type CalloutData = {
  id: string;
  sceneId: string;
  selector: string;
  label?: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  box: Box;
};

export type CaptionData = {
  start: number;
  end: number;
  text: string;
  sceneId: string;
};

export type VoiceoverData = {
  mode: "scene";
  files: Array<{
    sceneId: string;
    file: string;
    duration?: number;
  }>;
};

export type WalkthroughProps = {
  id: string;
  audioFile?: string;
  durationInFrames?: number;
};

type Assets = {
  walkthrough: WalkthroughData;
  callouts: CalloutData[];
  captions: CaptionData[];
  voiceover: VoiceoverData | null;
};

export const Walkthrough: React.FC<WalkthroughProps> = ({ id, audioFile = "voiceover.wav" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const assets = useWalkthroughAssets(id);
  const audioStartFrame = useMemo(() => {
    if (!assets?.captions.length) return 0;
    return Math.max(0, Math.round(assets.captions[0].start * fps));
  }, [assets, fps]);

  const activeTitleScene = useMemo(() => {
    if (!assets) return null;
    return assets.walkthrough.scenes.find(
      (scene) => scene.type === "title" && frame >= scene.startFrame && frame < scene.endFrame,
    );
  }, [assets, frame]);

  if (!assets) {
    return <AbsoluteFill style={{ backgroundColor: "#080908" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#080908", fontFamily: "Arial, sans-serif" }}>
      <BrowserVideo src={staticFile(`videos/${id}/capture.webm`)} />
      <VoiceoverTracks
        id={id}
        audioFile={audioFile}
        audioStartFrame={audioStartFrame}
        scenes={assets.walkthrough.scenes}
        voiceover={assets.voiceover}
      />
      <Callouts
        callouts={assets.callouts}
        frame={frame}
        viewport={assets.walkthrough.capturedViewport ?? { width: 1920, height: 1080 }}
      />
      <Captions captions={assets.captions} time={frame / fps} />
      <BrandBug />
      {activeTitleScene ? (
        <Sequence from={activeTitleScene.startFrame} durationInFrames={activeTitleScene.endFrame - activeTitleScene.startFrame}>
          <TitleCard title={activeTitleScene.title ?? assets.walkthrough.title} body={activeTitleScene.narration} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

function VoiceoverTracks({
  id,
  audioFile,
  audioStartFrame,
  scenes,
  voiceover,
}: {
  id: string;
  audioFile: string;
  audioStartFrame: number;
  scenes: CapturedScene[];
  voiceover: VoiceoverData | null;
}) {
  if (voiceover?.mode === "scene" && voiceover.files.length) {
    return (
      <>
        {voiceover.files.map((file) => {
          const scene = scenes.find((candidate) => candidate.id === file.sceneId);
          if (!scene) return null;
          return (
            <Sequence key={file.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame}>
              <Audio src={staticFile(`videos/${id}/${file.file}`)} />
            </Sequence>
          );
        })}
      </>
    );
  }

  return (
    <Sequence from={audioStartFrame}>
      <Audio src={staticFile(`videos/${id}/${audioFile}`)} />
    </Sequence>
  );
}

function useWalkthroughAssets(id: string) {
  const [assets, setAssets] = useState<Assets | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`Load walkthrough assets for ${id}`));

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchJson<WalkthroughData>(`videos/${id}/walkthrough.json`),
      fetchJson<CalloutData[]>(`videos/${id}/callouts.json`),
      fetchJson<CaptionData[]>(`videos/${id}/captions.json`),
      fetchJson<VoiceoverData>(`videos/${id}/voiceover.json`, { optional: true }),
    ])
      .then(([walkthrough, callouts, captions, voiceover]) => {
        if (!isMounted) return;
        setAssets({ walkthrough, callouts, captions, voiceover });
        continueRender(handle);
      })
      .catch((error) => {
        cancelRender(error instanceof Error ? error : new Error(String(error)));
      });

    return () => {
      isMounted = false;
    };
  }, [cancelRender, continueRender, handle, id]);

  return assets;
}

function fetchJson<T>(path: string): Promise<T>;
function fetchJson<T>(path: string, options: { optional: true }): Promise<T | null>;
async function fetchJson<T>(path: string, options: { optional?: boolean } = {}): Promise<T | null> {
  const response = await fetch(staticFile(path));
  if (!response.ok) {
    if (options.optional && response.status === 404) return null;
    throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}
