import React from "react";
import { AbsoluteFill } from "remotion";

export const TitleCard: React.FC<{ title: string; body: string }> = ({ title, body }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: "0 190px",
        backgroundColor: "#080908",
        color: "#fafaf7",
      }}
    >
      <div style={{ color: "#00a36c", fontSize: 28, fontWeight: 700, marginBottom: 26 }}>
        Product walkthrough
      </div>
      <h1 style={{ margin: 0, maxWidth: 1180, fontSize: 76, lineHeight: 1.05, fontWeight: 760 }}>
        {title}
      </h1>
      <p style={{ margin: "34px 0 0", maxWidth: 1220, fontSize: 36, lineHeight: 1.35, color: "#d8ded9" }}>
        {body}
      </p>
    </AbsoluteFill>
  );
};
