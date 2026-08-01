"use client";

import React from "react";

/**
 * Watermark layer: "音楽ゲーム学園" text in a grid pattern.
 * - 1 row = 5 items
 * - Rotated -30 degrees
 * - Opacity 12%
 * - Font: Zen Kurenaido
 */
export default function Watermark() {
  const text = "音楽ゲーム学園";
  const rows = 12;
  const cols = 5;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          width: "150%",
          height: "150%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`wm-row-${rowIdx}`}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              width: "100%",
            }}
          >
            {Array.from({ length: cols }).map((_, colIdx) => (
              <span
                key={`wm-${rowIdx}-${colIdx}`}
                style={{
                  fontFamily: "'Zen Kurenaido', 'Noto Sans JP', sans-serif",
                  fontSize: "24px",
                  color: "#000000",
                  opacity: 0.12,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  letterSpacing: "0.1em",
                }}
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
