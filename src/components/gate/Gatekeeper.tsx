"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useIsDesktop } from "@/lib/device";

type HoveredSide = "left" | "right" | null;

export function Gatekeeper() {
  const isDesktop = useIsDesktop();
  const [hovered, setHovered] = useState<HoveredSide>(null);

  return (
    <div className="rose-pine" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
      {/* Section 1 — Hero */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center"
        style={{ background: "var(--rp-base)" }}
      >
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
            style={{ color: "var(--rp-text)" }}
          >
            Adam Porbanderwalla
          </h1>
          <p
            className="text-lg sm:text-xl tracking-wide"
            style={{ color: "var(--rp-iris)" }}
          >
            Full-Stack Developer | Studying Computer Science
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--rp-muted)" }}
          >
            scroll
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: "var(--rp-muted)", animation: "bounce-down 2s ease-in-out infinite" }}
          >
            <path
              d="M4 7l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Section 2 — Full-Page Experience Chooser */}
      <section
        className="relative flex min-h-screen flex-col md:flex-row"
        style={{ background: "var(--rp-base)" }}
      >
        {/* "Choose your experience." heading — centered at top */}
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
            background: hovered === "left"
              ? "var(--rp-overlay)"
              : "var(--rp-base)",
            opacity: hovered === "right" ? 0.4 : 1,
            borderRight: "1px solid var(--rp-highlight-med)",
          }}
          onMouseEnter={() => setHovered("left")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div
              className="text-5xl font-bold transition-colors duration-500"
              style={{ color: hovered === "left" ? "var(--rp-foam)" : "var(--rp-pine)" }}
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
                borderColor: hovered === "left" ? "var(--rp-foam)" : "var(--rp-highlight-high)",
                color: hovered === "left" ? "var(--rp-foam)" : "var(--rp-subtle)",
                background: hovered === "left" ? "rgba(156, 207, 216, 0.05)" : "transparent",
              }}
            >
              ENTER
            </div>
            {!isDesktop && (
              <span
                className="mt-2 text-xs"
                style={{ color: "var(--rp-love)" }}
              >
                (Desktop only)
              </span>
            )}
          </div>
        </Link>

        {/* Right — 2D Portfolio */}
        <div
          className="relative flex flex-1 flex-col items-center justify-center cursor-not-allowed transition-all duration-500 ease-out"
          style={{
            background: hovered === "right"
              ? "var(--rp-overlay)"
              : "var(--rp-base)",
            opacity: hovered === "left" ? 0.4 : 1,
          }}
          onMouseEnter={() => setHovered("right")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div
              className="text-5xl font-bold transition-colors duration-500"
              style={{ color: hovered === "right" ? "var(--rp-iris)" : "var(--rp-highlight-high)" }}
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
