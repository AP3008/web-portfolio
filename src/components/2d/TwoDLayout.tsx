"use client";

import { useState, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";
import { TransitionOverlay } from "./TransitionOverlay";
import { Navigator } from "./Navigator";

interface TwoDLayoutProps {
  children: ReactNode;
  backHref?: string;
}

export function TwoDLayout({
  children,
  backHref = ROUTES.HOME,
}: TwoDLayoutProps) {
  const [navOpen, setNavOpen] = useState(false);

  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);

  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);

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
      <TransitionOverlay color={palette.iris} />

      {/* Back button */}
      <Link
        href={backHref}
        className="fixed top-6 left-6 z-30 flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm tracking-wider transition-all duration-200"
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
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        BACK
      </Link>

      {/* Navigator toggle */}
      <button
        onClick={() => setNavOpen(true)}
        className="fixed top-6 right-6 z-30 rounded-lg border p-3 transition-all duration-200"
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
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M3 5h14" />
          <path d="M3 10h14" />
          <path d="M3 15h14" />
        </svg>
      </button>

      <Navigator open={navOpen} onClose={() => setNavOpen(false)} />

      {children}
    </div>
  );
}
