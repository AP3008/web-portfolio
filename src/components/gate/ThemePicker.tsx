"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import {
  ROSE_PINE_PALETTES,
  TEXT_COLOR_OPTIONS,
  TEXT_COLOR_OPTIONS_DAWN,
} from "@/lib/themes";
import type { ThemeVariant } from "@/lib/themes";

const VARIANT_LABELS: { key: ThemeVariant; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "moon", label: "Moon" },
  { key: "dawn", label: "Dawn" },
];

interface ThemePickerProps {
  mode?: "compact" | "expanded";
}

export function ThemePicker({ mode = "compact" }: ThemePickerProps) {
  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);
  const setVariant = useThemeStore((s) => s.setVariant);
  const setTextColor = useThemeStore((s) => s.setTextColor);

  const [hoveredVariant, setHoveredVariant] = useState<ThemeVariant | null>(null);
  const isExpanded = mode === "expanded";
  const palette = ROSE_PINE_PALETTES[variant];

  const colorOptions = variant === "dawn" ? TEXT_COLOR_OPTIONS_DAWN : TEXT_COLOR_OPTIONS;

  // Floating ring for color circles
  const circleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ringStyle, setRingStyle] = useState<React.CSSProperties | null>(null);
  const hasAnimated = useRef(false);

  const updateRing = useCallback(() => {
    const idx = (colorOptions as readonly string[]).indexOf(textColor);
    const btn = circleRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) { setRingStyle(null); return; }
    const offset = isExpanded ? 4 : 3;
    setRingStyle({
      left: btn.offsetLeft - offset - 2,
      top: btn.offsetTop - offset - 2,
      width: btn.offsetWidth + (offset + 2) * 2,
      height: btn.offsetHeight + (offset + 2) * 2,
    });
  }, [textColor, colorOptions, isExpanded]);

  useLayoutEffect(() => {
    // Skip transition on first render
    if (!hasAnimated.current) {
      hasAnimated.current = true;
    }
    updateRing();
  }, [updateRing]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updateRing());
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateRing]);

  return (
    <div
      className={
        isExpanded
          ? "flex w-full max-w-2xl flex-col items-center gap-8 rounded-xl border p-6 sm:p-8"
          : "flex w-full flex-col items-center gap-6 rounded-lg border p-4 sm:w-auto sm:p-6"
      }
      style={{
        background: palette.surface,
        borderColor: palette.highlightMed,
      }}
    >
      {/* Rosé Pine label */}
      <span
        className={isExpanded ? "text-center text-4xl sm:text-5xl" : "text-center text-3xl"}
        style={{
          fontFamily: "'Hurricane', cursive",
          color: isExpanded ? textColor : palette.rose,
        }}
      >
        Rosé Pine
      </span>

      {/* Theme variant buttons */}
      <div className="flex w-full flex-col gap-2 sm:w-auto">
        <span
          className={isExpanded ? "text-sm uppercase tracking-widest" : "text-xs uppercase tracking-widest"}
          style={{ color: palette.muted }}
        >
          Theme
        </span>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {VARIANT_LABELS.map(({ key, label }) => {
            const isActive = variant === key;
            const isHovered = hoveredVariant === key;
            return (
              <button
                key={key}
                onClick={() => setVariant(key)}
                onMouseEnter={() => setHoveredVariant(key)}
                onMouseLeave={() => setHoveredVariant(null)}
                disabled={isActive}
                className={
                  isExpanded
                    ? "rounded border px-5 py-2 text-sm font-semibold tracking-wider transition-colors duration-150 disabled:cursor-default disabled:opacity-100 sm:px-6 sm:py-2.5 sm:text-base"
                    : "rounded px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-150 disabled:cursor-default disabled:opacity-100 sm:px-4 sm:text-sm sm:tracking-wider"
                }
                style={{
                  background: isActive
                    ? palette.overlay
                    : isHovered
                      ? isExpanded
                        ? palette.highlightMed
                        : palette.highlightLow
                      : "transparent",
                  color: isActive
                    ? palette.iris
                    : isHovered
                      ? textColor
                      : palette.subtle,
                  outline: isActive
                    ? `2px solid ${palette.iris}`
                    : "2px solid transparent",
                  outlineOffset: "2px",
                  cursor: isActive ? "default" : "pointer",
                  border: isExpanded
                    ? "1px solid " +
                      (isActive
                        ? palette.iris
                        : isHovered
                          ? palette.highlightHigh
                          : palette.highlightMed)
                    : "1px solid " +
                      (isActive
                        ? palette.iris
                        : isHovered
                          ? palette.highlightHigh
                          : palette.highlightMed),
                }}
                aria-pressed={isActive}
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
          className={isExpanded ? "text-sm uppercase tracking-widest" : "text-xs uppercase tracking-widest"}
          style={{ color: palette.muted }}
        >
          Text Colour
        </span>
        <div
          ref={containerRef}
          className={isExpanded ? "relative flex flex-wrap gap-4" : "relative flex flex-wrap gap-3"}
        >
          {ringStyle && (
            <div
              style={{
                position: "absolute",
                borderRadius: "9999px",
                border: `2px solid ${textColor}`,
                pointerEvents: "none",
                transition: hasAnimated.current
                  ? "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
                ...ringStyle,
              }}
            />
          )}
          {colorOptions.map((color, i) => (
            <button
              key={color}
              ref={(el) => { circleRefs.current[i] = el; }}
              onClick={() => setTextColor(color)}
              className={
                isExpanded
                  ? "h-10 w-10 rounded-full"
                  : "h-7 w-7 rounded-full"
              }
              style={{ background: color }}
              aria-label={`Set text color to ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
