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
      className="flex w-full max-w-[20rem] flex-col gap-5 rounded-lg border p-4 sm:p-6"
      style={{
        background: "var(--rp-surface)",
        borderColor: "var(--rp-highlight-med)",
      }}
    >
      {/* Rosé Pine label */}
      <span
        className="text-center text-3xl"
        style={{
          fontFamily: "'Hurricane', cursive",
          color: "var(--rp-rose)",
        }}
      >
        Rosé Pine
      </span>

      {/* Theme variant buttons */}
      <div className="flex w-full flex-col gap-2">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--rp-muted)" }}
        >
          Theme
        </span>
        <div className="grid w-full grid-cols-3 gap-2">
          {VARIANT_LABELS.map(({ key, label }) => {
            const isActive = variant === key;
            const isHovered = hoveredVariant === key;
            return (
              <button
                key={key}
                onClick={() => setVariant(key)}
                onMouseEnter={() => setHoveredVariant(key)}
                onMouseLeave={() => setHoveredVariant(null)}
                className="w-full min-w-0 rounded px-2 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 sm:px-4 sm:text-sm sm:tracking-wider"
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
      <div className="flex w-full flex-col gap-2">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--rp-muted)" }}
        >
          Text Colour
        </span>
        <div className="flex flex-wrap gap-3">
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
