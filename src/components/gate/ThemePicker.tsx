"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import {
  TEXT_COLOR_OPTIONS,
  TEXT_COLOR_OPTIONS_DAWN,
} from "@/lib/themes";
import type { ThemeVariant } from "@/lib/themes";

const VARIANT_LABELS: { key: ThemeVariant; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "moon", label: "Moon" },
  { key: "dawn", label: "Dawn" },
];

export function ThemePicker() {
  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);
  const setVariant = useThemeStore((s) => s.setVariant);
  const setTextColor = useThemeStore((s) => s.setTextColor);

  const [hoveredVariant, setHoveredVariant] = useState<ThemeVariant | null>(null);

  const colorOptions = variant === "dawn" ? TEXT_COLOR_OPTIONS_DAWN : TEXT_COLOR_OPTIONS;

  return (
    <div
      className="flex flex-col items-center gap-6 rounded-lg border p-6"
      style={{
        background: "var(--rp-surface)",
        borderColor: "var(--rp-highlight-med)",
      }}
    >
      {/* Rosé Pine label */}
      <span
        className="text-3xl text-center"
        style={{
          fontFamily: "'Hurricane', cursive",
          color: "var(--rp-rose)",
        }}
      >
        Rosé Pine
      </span>

      {/* Theme variant buttons */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--rp-muted)" }}
        >
          Theme
        </span>
        <div className="flex gap-2">
          {VARIANT_LABELS.map(({ key, label }) => {
            const isActive = variant === key;
            const isHovered = hoveredVariant === key;
            return (
              <button
                key={key}
                onClick={() => setVariant(key)}
                onMouseEnter={() => setHoveredVariant(key)}
                onMouseLeave={() => setHoveredVariant(null)}
                className="rounded px-4 py-1.5 text-sm font-medium tracking-wider transition-all duration-200"
                style={{
                  background: isActive
                    ? "var(--rp-overlay)"
                    : isHovered
                      ? "var(--rp-highlight-low)"
                      : "transparent",
                  color: isActive
                    ? "var(--rp-iris)"
                    : isHovered
                      ? "var(--rp-text)"
                      : "var(--rp-subtle)",
                  outline: isActive
                    ? "2px solid var(--rp-iris)"
                    : "2px solid transparent",
                  outlineOffset: "2px",
                  border:
                    "1px solid " +
                    (isActive
                      ? "var(--rp-iris)"
                      : isHovered
                        ? "var(--rp-highlight-high)"
                        : "var(--rp-highlight-med)"),
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text color circles */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--rp-muted)" }}
        >
          Text Colour
        </span>
        <div className="flex gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setTextColor(color)}
              className="h-7 w-7 rounded-full transition-all duration-200"
              style={{
                background: color,
                outline:
                  textColor === color
                    ? `2px solid ${color}`
                    : "2px solid transparent",
                outlineOffset: "3px",
              }}
              aria-label={`Set text color to ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
