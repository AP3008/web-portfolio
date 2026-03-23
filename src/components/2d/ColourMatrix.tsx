"use client";

import { useState, useEffect, useCallback } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { getMatrixColors } from "@/lib/matrixColors";

type Matrix = number[][];

const DEFAULT_MATRIX: Matrix = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function GridIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function ColourMatrix() {
  const [matrix, setMatrix] = useState<Matrix>(DEFAULT_MATRIX);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);
  const showTooltip = hovered || pinned;
  const colors = getMatrixColors(variant);

  useEffect(() => {
    fetch("/api/colour-matrix")
      .then((res) => res.json())
      .then((data) => {
        if (data.matrix) setMatrix(data.matrix);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTileClick = useCallback(
    (row: number, col: number) => {
      // Optimistic update
      setMatrix((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = prev[row][col] === 1 ? 0 : 1;
        return next;
      });

      // POST toggle to API
      fetch("/api/colour-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col }),
      }).catch(() => {
        // Revert on failure
        setMatrix((prev) => {
          const reverted = prev.map((r) => [...r]);
          reverted[row][col] = prev[row][col] === 1 ? 0 : 1;
          return reverted;
        });
      });
    },
    []
  );

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-sm uppercase tracking-widest"
          style={{ color: "var(--rp-muted)" }}
        >
          <GridIcon />
          Colour Matrix
        </div>

        {/* Info icon */}
        <button
          type="button"
          className="cursor-help"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setPinned((p) => !p)}
          style={{
            color: hovered || pinned ? textColor : "var(--rp-muted)",
            transition: "color 0.2s ease",
          }}
        >
          <InfoIcon />
        </button>
      </div>

      {/* Grid wrapper — relative so tooltip overlays it */}
      <div className="relative flex-1">
        {loading ? (
          <div
            className="flex h-full items-center justify-center rounded-lg"
            style={{ background: "var(--rp-overlay)" }}
          >
            <span
              className="text-sm tracking-wide"
              style={{ color: "var(--rp-muted)" }}
            >
              …
            </span>
          </div>
        ) : (
          <div
            className="grid h-full grid-cols-3 gap-2"
            style={{ perspective: "600px" }}
          >
          {matrix.map((row, ri) =>
            row.map((val, ci) => {
              const tileIndex = ri * 3 + ci;
              const flipped = val === 1;
              return (
                <button
                  key={`${ri}-${ci}`}
                  type="button"
                  onClick={() => handleTileClick(ri, ci)}
                  className="aspect-square w-full cursor-pointer"
                  style={{
                    perspective: "600px",
                  }}
                  aria-label={`Tile ${tileIndex + 1}, ${flipped ? "flipped" : "hidden"}`}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s ease",
                      transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front face (hidden state) */}
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "var(--rp-overlay)",
                      }}
                    />
                    {/* Back face (flipped state — shows color) */}
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: colors[tileIndex],
                      }}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
        )}

        {/* Tooltip overlay — sits on top of the grid */}
        {showTooltip && (
          <div
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-lg p-4"
            onClick={() => setPinned(false)}
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <div
              className="rounded-lg px-4 py-3 text-sm leading-relaxed"
              style={{
                background: "var(--rp-surface)",
                opacity: 0.92,
                color: "var(--rp-text)",
              }}
            >
              This is a pointless little way for you to leave an impact on the
              webpage. When you flip over a tile or hide it, the next viewer
              will see the website the way you left it.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
