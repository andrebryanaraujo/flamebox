import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div
      className="skeleton"
      style={{
        position: "relative",
        borderRadius: "12px",
        aspectRatio: "4/3",
        overflow: "hidden",
        border: "1px solid var(--purple-border)",
      }}
    >
      {/* Bottom content lines */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0.9rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        <div style={{ width: "80%", height: "14px", borderRadius: "4px", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ width: "45%", height: "18px", borderRadius: "4px", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ width: "35%", height: "11px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ width: "100%", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", marginTop: "0.25rem" }} />
      </div>
    </div>
  );
}

