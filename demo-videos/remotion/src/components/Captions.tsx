import React from "react";
import { AbsoluteFill } from "remotion";
import type { CaptionData } from "../Walkthrough";

export const Captions: React.FC<{ captions: CaptionData[]; time: number }> = ({ captions, time }) => {
  const active = captions.find((caption) => time >= caption.start && time <= caption.end);
  if (!active) return null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1320,
          padding: "18px 26px",
          backgroundColor: "rgba(8, 9, 8, 0.78)",
          color: "#fff",
          fontSize: 34,
          lineHeight: 1.25,
          textAlign: "center",
          borderRadius: 8,
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
