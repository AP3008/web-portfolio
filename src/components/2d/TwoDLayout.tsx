"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useIsDesktop } from "@/lib/device";
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
  const [showDesktopNotice, setShowDesktopNotice] = useState(false);
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

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

  useEffect(() => {
    const pending = sessionStorage.getItem("desktop_redirect_notice_pending");
    if (pending !== "1") return;

    sessionStorage.removeItem("desktop_redirect_notice_pending");
    const openTimer = setTimeout(() => setShowDesktopNotice(true), 0);
    const closeTimer = setTimeout(() => setShowDesktopNotice(false), 3500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const isMobile = !isDesktop;
  const isTwoDHome = pathname === ROUTES.TWO_D;
  const showBackButton = !(isMobile && isTwoDHome);
 
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
      {showBackButton && (
        <Link
          href={backHref}
          className="fixed top-5 left-4 z-30 flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs tracking-wider transition-all duration-200 sm:top-6 sm:left-6 sm:gap-2.5 sm:px-4 sm:py-2.5 sm:text-sm"
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
            width="16"
            height="16"
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
      )}

      {/* Navigator toggle */}
      <button
        onClick={() => setNavOpen(true)}
        className="fixed top-5 right-4 z-30 rounded-lg border p-2 transition-all duration-200 sm:top-6 sm:right-6 sm:p-3"
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
          width="18"
          height="18"
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

      {showDesktopNotice && (
        <div
          className="fixed top-16 right-4 z-40 max-w-[19rem] rounded-lg border px-3 py-2.5 text-xs shadow-lg sm:top-20 sm:right-6"
          style={{
            background: "var(--rp-surface)",
            borderColor: "var(--rp-highlight-med)",
            color: "var(--rp-subtle)",
          }}
        >
          <div className="flex items-start gap-2">
            <span style={{ color: "var(--rp-foam)" }}>i</span>
            <p className="leading-relaxed">
              To experience the full website try on desktop
            </p>
            <button
              onClick={() => setShowDesktopNotice(false)}
              className="ml-auto text-xs transition-colors"
              style={{ color: "var(--rp-muted)" }}
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
