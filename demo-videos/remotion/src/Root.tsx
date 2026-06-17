import React from "react";
import { Composition, registerRoot } from "remotion";
import { Walkthrough, type WalkthroughProps } from "./Walkthrough";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Walkthrough"
      component={Walkthrough}
      durationInFrames={75 * 30}
      calculateMetadata={({ props }) => ({
        durationInFrames: props.durationInFrames ?? 75 * 30,
      })}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ id: "cost-walkthrough", audioFile: "voiceover.wav" } satisfies WalkthroughProps}
    />
  );
};

registerRoot(RemotionRoot);
