"use client";

import { socialLinks } from "@/components/desk/data/socials";
import { InfoBar } from "./InfoBar";

export function SocialsSection() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16 sm:gap-10 sm:px-8 sm:py-24 md:px-16 lg:px-24"
    >
      <h2
        className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
        style={{ color: "var(--rp-text)" }}
      >
        Socials
      </h2>

      <div className="flex w-full max-w-2xl flex-col gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-200 sm:gap-5 sm:px-6 sm:py-5"
            style={{
              background: "var(--rp-surface)",
              borderColor: "var(--rp-highlight-med)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--rp-iris)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--rp-highlight-med)";
            }}
          >
            {/* Icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
              style={{ background: "var(--rp-overlay)" }}
            >
              <svg
                viewBox={link.viewBox ?? "0 0 24 24"}
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="var(--rp-iris)"
              >
                <path d={link.iconPath} />
              </svg>
            </div>

            {/* Label + URL */}
            <div className="flex min-w-0 flex-col">
              <span
                className="text-sm font-medium sm:text-base"
                style={{ color: "var(--rp-text)" }}
              >
                {link.label}
              </span>
              <span
                className="truncate text-xs sm:text-sm"
                style={{ color: "var(--rp-muted)" }}
              >
                {link.url
                  .replace(/^https?:\/\/(www\.)?/, "")
                  .replace(/\/$/, "")}
              </span>
            </div>

            {/* Arrow */}
            <svg
              viewBox="0 0 24 24"
              className="ml-auto h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              fill="none"
              stroke="var(--rp-muted)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        ))}
      </div>

      <InfoBar />
    </section>
  );
}
