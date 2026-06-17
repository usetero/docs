import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";

export const BrowserVideo: React.FC<{ src: string }> = ({ src }) => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        muted
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#080908",
        }}
      />
    </AbsoluteFill>
  );
};
