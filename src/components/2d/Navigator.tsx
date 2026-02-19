"use client";

import { ThemePicker } from "@/components/gate/ThemePicker";

interface NavigatorProps {
  open: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Socials", href: "#socials" },
  { label: "Resume", href: "#resume" },
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
        className="fixed top-0 right-0 z-50 flex h-full w-80 flex-col gap-8 overflow-y-auto p-6 transition-transform duration-300 ease-out"
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

        {/* Section Links */}
        <nav className="flex flex-col gap-1">
          <span
            className="mb-2 text-xs uppercase tracking-widest"
            style={{ color: "var(--rp-muted)" }}
          >
            Navigate
          </span>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              className="rounded px-4 py-2.5 text-sm tracking-wider transition-all duration-200"
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
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
