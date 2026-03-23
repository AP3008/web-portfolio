"use client";

import Link from "next/link";
import { ThemePicker } from "@/components/gate/ThemePicker";
import { SpotifyBox } from "./SpotifyBox";
import { ASSETS } from "@/lib/constants";

interface NavigatorProps {
  open: boolean;
  onClose: () => void;
}

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/2d" },
  { label: "About", href: "/2d/about" },
  { label: "Projects", href: "/2d/projects" },
  { label: "Socials", href: "/2d/socials" },
  { label: "Resume", href: ASSETS.RESUME_PDF, external: true },
];

export function Navigator({ open, onClose }: NavigatorProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className="fixed top-0 right-0 z-50 flex h-full w-80 max-w-[92vw] flex-col gap-7 overflow-y-auto p-5 transition-transform duration-300 ease-out sm:w-96 sm:gap-9 sm:p-7"
        style={{
          background: "var(--rp-base)",
          borderLeft: "1px solid var(--rp-highlight-med)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="self-end p-2 transition-colors duration-200"
          style={{ color: "var(--rp-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-muted)")}
          aria-label="Close navigator"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>

        {/* Theme Picker */}
        <ThemePicker />

        {/* Spotify Player */}
        <SpotifyBox />

        {/* Section Links */}
        <nav className="flex flex-col gap-1">
          <span
            className="mb-2 text-xs uppercase tracking-widest sm:text-sm"
            style={{ color: "var(--rp-muted)" }}
          >
            Navigate
          </span>
          {NAV_LINKS.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                onClick={onClose}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded px-3 py-2.5 text-sm tracking-wider transition-all duration-200 sm:px-4 sm:py-3 sm:text-base"
                style={{ color: "var(--rp-subtle)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--rp-text)";
                  e.currentTarget.style.background = "var(--rp-highlight-low)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--rp-subtle)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {label}
                <span className="ml-2 text-xs sm:text-sm" style={{ color: "var(--rp-muted)" }}>↗</span>
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className="rounded px-3 py-2.5 text-sm tracking-wider transition-all duration-200 sm:px-4 sm:py-3 sm:text-base"
                style={{ color: "var(--rp-subtle)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--rp-text)";
                  e.currentTarget.style.background = "var(--rp-highlight-low)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--rp-subtle)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {label}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
}
