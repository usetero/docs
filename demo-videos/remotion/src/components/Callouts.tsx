import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { CalloutData } from "../Walkthrough";

export const Callouts: React.FC<{
  callouts: CalloutData[];
  frame: number;
  viewport: { width: number; height: number };
}> = ({ callouts, frame, viewport }) => {
  const { width, height } = useVideoConfig();
  const active = callouts.filter((callout) => frame >= callout.startFrame && frame <= callout.endFrame);
  const scale = Math.min(width / viewport.width, height / viewport.height);
  const offsetX = (width - viewport.width * scale) / 2;
  const offsetY = (height - viewport.height * scale) / 2;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {active.map((callout) => (
        <div
          key={callout.id}
          style={{
            position: "absolute",
            left: offsetX + callout.box.x * scale - 6,
            top: offsetY + callout.box.y * scale - 6,
            width: callout.box.width * scale + 12,
            height: callout.box.height * scale + 12,
            border: "3px solid rgba(0, 163, 108, 0.9)",
            boxShadow: "0 0 0 1px rgba(250, 250, 247, 0.7), 0 8px 24px rgba(0, 163, 108, 0.22)",
            borderRadius: 10,
          }}
        >
          {callout.label ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -54,
                maxWidth: 560,
                padding: "10px 14px",
                backgroundColor: "rgba(0, 112, 76, 0.94)",
                color: "white",
                fontSize: 28,
                fontWeight: 700,
                borderRadius: 6,
              }}
            >
              {callout.label}
            </div>
          ) : null}
        </div>
      ))}
    </AbsoluteFill>
  );
};
