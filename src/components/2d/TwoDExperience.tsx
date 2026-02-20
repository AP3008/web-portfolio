"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { TransitionOverlay } from "./TransitionOverlay";
import { Navigator } from "./Navigator";
import { ProjectTriangle } from "./ProjectTriangle";
import { AboutSection } from "./AboutSection";
import { ProjectsSection } from "./ProjectsSection";
import { SocialsSection } from "./SocialsSection";

const GREETING = "Hey! I'm Adam";
const TYPING_SPEED_MS = 80;

export function TwoDExperience() {
  const [navOpen, setNavOpen] = useState(false);

  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);

  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);

  const displayed = useTypingEffect(GREETING, TYPING_SPEED_MS);

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
      className="rose-pine min-h-screen"
      style={{
        fontFamily: "'JetBrains Mono', var(--font-jetbrains-mono), monospace",
        background: "var(--rp-base)",
        ...themeVars,
      }}
    >
      {/* GSAP entrance transition */}
      <TransitionOverlay color={palette.iris} />

      {/* Back to Gatekeeper — top left */}
      <Link
        href={ROUTES.HOME}
        className="fixed top-6 left-6 z-30 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs tracking-wider transition-all duration-200"
        style={{
          background: "var(--rp-surface)",
          borderColor: "var(--rp-highlight-med)",
          color: "var(--rp-subtle)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--rp-iris)";
          e.currentTarget.style.color = "var(--rp-text)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--rp-highlight-med)";
          e.currentTarget.style.color = "var(--rp-subtle)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        BACK
      </Link>

      {/* Navigator toggle — top right */}
      <button
        onClick={() => setNavOpen(true)}
        className="fixed top-6 right-6 z-30 rounded-lg border p-2.5 transition-all duration-200"
        style={{
          background: "var(--rp-surface)",
          borderColor: "var(--rp-highlight-med)",
          color: "var(--rp-subtle)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--rp-iris)";
          e.currentTarget.style.color = "var(--rp-text)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--rp-highlight-med)";
          e.currentTarget.style.color = "var(--rp-subtle)";
        }}
        aria-label="Open navigator"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 5h14" />
          <path d="M3 10h14" />
          <path d="M3 15h14" />
        </svg>
      </button>

      {/* Navigator panel */}
      <Navigator open={navOpen} onClose={() => setNavOpen(false)} />

      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="flex w-full max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-16">
          {/* Left — title & blurb */}
          <div className="flex flex-1 flex-col gap-6 text-left">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
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
              className="text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--rp-subtle)" }}
            >
              I&apos;m a full-stack developer and computer science student with a
              passion for building interactive, performant web experiences. From
              immersive 3D portfolios to scalable backend systems, I love turning
              complex ideas into elegant code. When I&apos;m not coding, you&apos;ll
              find me at the gym, playing chess, or tinkering with new technologies.
            </p>
          </div>

          {/* Right — drawing */}
          <div className="flex flex-1 items-center justify-center">
            <Image
              src="/adam_drawing.png"
              alt="Drawing of Adam"
              width={400}
              height={400}
              className="max-w-full rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="flex flex-col items-center gap-10 px-8 py-24 md:px-16 lg:px-24">
        {/* Header */}
        <div className="flex w-full max-w-xl items-center justify-between">
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--rp-text)" }}
          >
            Featured Projects
          </h2>
          <a
            href="#all-projects"
            className="rounded border px-4 py-1.5 text-xs tracking-wider transition-all duration-200"
            style={{
              borderColor: "var(--rp-highlight-high)",
              color: "var(--rp-subtle)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--rp-iris)";
              e.currentTarget.style.color = "var(--rp-iris)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--rp-highlight-high)";
              e.currentTarget.style.color = "var(--rp-subtle)";
            }}
          >
            VIEW ALL
          </a>
        </div>

        {/* Triangle flip cards */}
        <ProjectTriangle />

        {/* Learn more link */}
        <a
          href="#about"
          className="text-sm tracking-wider transition-colors duration-200"
          style={{ color: "var(--rp-foam)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-foam)")}
        >
          Learn more about me! →
        </a>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* All Projects Section */}
      <ProjectsSection />

      {/* Socials Section */}
      <SocialsSection />
    </div>
  );
}
