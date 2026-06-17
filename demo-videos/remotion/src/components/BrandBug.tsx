import React from "react";
import { AbsoluteFill } from "remotion";

export const BrandBug: React.FC = () => {
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", padding: 32, pointerEvents: "none" }}>
      <div
        style={{
          padding: "10px 14px",
          backgroundColor: "rgba(250, 250, 247, 0.92)",
          color: "#080908",
          fontSize: 26,
          fontWeight: 700,
          borderRadius: 6,
          letterSpacing: 0,
        }}
      >
        Tero
      </div>
    </AbsoluteFill>
  );
};
