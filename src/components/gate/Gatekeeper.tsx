"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useIsDesktop } from "@/lib/device";
import { useThemeStore } from "@/store/useThemeStore";
import {
  TEXT_COLOR_OPTIONS,
  TEXT_COLOR_OPTIONS_DAWN,
  ROSE_PINE_PALETTES,
} from "@/lib/themes";
import type { ThemeVariant } from "@/lib/themes";

type HoveredSide = "left" | "right" | null;

const FULL_NAME = "Adam Porbanderwalla";
const TYPING_SPEED_MS = 80;

const VARIANT_LABELS: { key: ThemeVariant; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "moon", label: "Moon" },
  { key: "dawn", label: "Dawn" },
];

function useTypingEffect(text: string, speed: number) {
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (displayedCount >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + 1);
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayedCount, text, speed]);

  return text.slice(0, displayedCount);
}

export function Gatekeeper() {
  const isDesktop = useIsDesktop();
  const [hovered, setHovered] = useState<HoveredSide>(null);
  const [hoveredVariant, setHoveredVariant] = useState<ThemeVariant | null>(null);

  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);
  const setVariant = useThemeStore((s) => s.setVariant);
  const setTextColor = useThemeStore((s) => s.setTextColor);

  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const colorOptions = variant === "dawn" ? TEXT_COLOR_OPTIONS_DAWN : TEXT_COLOR_OPTIONS;

  const displayed = useTypingEffect(FULL_NAME, TYPING_SPEED_MS);

  const themeVars = useMemo(
    () =>
      ({
        "--rp-base": palette.base,
        "--rp-surface": palette.surface,
        "--rp-overlay": palette.overlay,
        "--rp-muted": palette.muted,
        "--rp-subtle": palette.subtle,
        "--rp-text": textColor,
        "--rp-love": palette.love,
        "--rp-gold": palette.gold,
        "--rp-rose": palette.rose,
        "--rp-pine": palette.pine,
        "--rp-foam": palette.foam,
        "--rp-iris": palette.iris,
        "--rp-highlight-low": palette.highlightLow,
        "--rp-highlight-med": palette.highlightMed,
        "--rp-highlight-high": palette.highlightHigh,
      }) as React.CSSProperties,
    [palette, textColor]
  );

  return (
    <div
      className="rose-pine"
      style={{
        fontFamily: "'JetBrains Mono', var(--font-jetbrains-mono), monospace",
        ...themeVars,
      }}
    >
      {/* Section 1 — Hero */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-8 md:flex-row md:items-center md:gap-16 md:px-16 lg:px-24"
        style={{ background: "var(--rp-base)" }}
      >
        {/* Left — Name + Subtitle (centered within its half) */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center md:items-start md:text-left">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ color: "var(--rp-text)" }}
          >
            {displayed}
            <span
              className="inline-block w-0.75 ml-1 align-baseline"
              style={{
                height: "0.8em",
                background: "var(--rp-text)",
                animation: "blink-cursor 1.06s step-end infinite",
              }}
            />
          </h1>
          <p
            className="text-base tracking-wide sm:text-lg md:text-xl"
            style={{ color: "var(--rp-iris)" }}
          >
            Full-Stack Developer | Studying Computer Science
          </p>
        </div>

        {/* Right — Palette Selector (center-right) */}
        <div className="flex flex-1 items-center justify-center">
          <div
            className="flex flex-col gap-6 rounded-lg border p-6"
            style={{
              background: "var(--rp-surface)",
              borderColor: "var(--rp-highlight-med)",
            }}
          >
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
                        border: "1px solid " + (isActive
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
        </div>
      </section>

      {/* Section 2 — Full-Page Experience Chooser */}
      <section
        className="relative flex min-h-screen flex-col md:flex-row"
        style={{ background: "var(--rp-base)" }}
      >
        <h2
          className="absolute top-8 left-1/2 z-10 -translate-x-1/2 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "var(--rp-text)" }}
        >
          Choose your experience.
        </h2>

        {/* Left — 3D Experience */}
        <Link
          href={ROUTES.THREE_D}
          className="relative flex flex-1 flex-col items-center justify-center transition-all duration-500 ease-out"
          style={{
            background:
              hovered === "left" ? "var(--rp-overlay)" : "var(--rp-base)",
            opacity: hovered === "right" ? 0.4 : 1,
            borderRight: "1px solid var(--rp-highlight-med)",
          }}
          onMouseEnter={() => setHovered("left")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div
              className="text-5xl font-bold transition-colors duration-500"
              style={{
                color:
                  hovered === "left" ? "var(--rp-foam)" : "var(--rp-pine)",
              }}
            >
              {"{ 3D }"}
            </div>
            <h3
              className="text-2xl font-semibold"
              style={{ color: "var(--rp-text)" }}
            >
              Learn about me through my desk
            </h3>
            <p
              className="max-w-sm text-sm leading-relaxed"
              style={{ color: "var(--rp-subtle)" }}
            >
              An immersive 3D workspace where every object tells a story.
            </p>
            <div
              className="mt-4 rounded border px-8 py-2 text-sm tracking-wider transition-all duration-300"
              style={{
                borderColor:
                  hovered === "left"
                    ? "var(--rp-foam)"
                    : "var(--rp-highlight-high)",
                color:
                  hovered === "left" ? "var(--rp-foam)" : "var(--rp-subtle)",
                background:
                  hovered === "left"
                    ? "rgba(156, 207, 216, 0.05)"
                    : "transparent",
              }}
            >
              ENTER
            </div>
            {!isDesktop && (
              <span className="mt-2 text-xs" style={{ color: "var(--rp-love)" }}>
                (Desktop only)
              </span>
            )}
          </div>
        </Link>

        {/* Right — 2D Portfolio */}
        <div
          className="relative flex flex-1 flex-col items-center justify-center cursor-not-allowed transition-all duration-500 ease-out"
          style={{
            background:
              hovered === "right" ? "var(--rp-overlay)" : "var(--rp-base)",
            opacity: hovered === "left" ? 0.4 : 1,
          }}
          onMouseEnter={() => setHovered("right")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div
              className="text-5xl font-bold transition-colors duration-500"
              style={{
                color:
                  hovered === "right"
                    ? "var(--rp-iris)"
                    : "var(--rp-highlight-high)",
              }}
            >
              {"< 2D />"}
            </div>
            <h3
              className="text-2xl font-semibold"
              style={{ color: "var(--rp-text)" }}
            >
              Meet the developer behind the page
            </h3>
            <p
              className="max-w-sm text-sm leading-relaxed"
              style={{ color: "var(--rp-subtle)" }}
            >
              A classic portfolio with projects, experience, and more.
            </p>
            <div
              className="mt-4 rounded border px-8 py-2 text-sm tracking-wider"
              style={{
                borderColor: "var(--rp-highlight-high)",
                color: "var(--rp-muted)",
              }}
            >
              COMING SOON
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
