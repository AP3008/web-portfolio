"use client";

import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { socialLinks } from "@/components/desk/data/socials";
import { SpotifyBox } from "./SpotifyBox";

const DISPLAY_SOCIALS = ["GitHub", "LinkedIn", "Instagram"];
const filteredSocials = socialLinks.filter((s) =>
  DISPLAY_SOCIALS.includes(s.label)
);

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CommitIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="8" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="16" x2="12" y2="23" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function InfoBar() {
  const textColor = useThemeStore((s) => s.textColor);
  const [time, setTime] = useState("");
  const [commit, setCommit] = useState<{
    shortSha: string;
    htmlUrl: string;
  } | null>(null);
  const [views, setViews] = useState<number | null>(null);
  const viewTracked = useRef(false);

  // Live clock — London, Ontario (Eastern Time)
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-CA", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch page views and increment (ref guard prevents double-fire in StrictMode)
  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;

    fetch("/api/track-view", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setViews(data.count);
      })
      .catch(() => {
        // Fallback: just fetch current count
        fetch("/api/views")
          .then((res) => res.json())
          .then((data) => {
            if (typeof data.count === "number") setViews(data.count);
          })
          .catch(() => {});
      });
  }, []);

  // Fetch latest web-portfolio commit
  useEffect(() => {
    fetch("/api/github-commits")
      .then((res) => {
        if (!res.ok) throw new Error("non-2xx");
        return res.json();
      })
      .then((data) => {
        const first = data.webPortfolioCommits?.[0];
        if (first)
          setCommit({ shortSha: first.shortSha, htmlUrl: first.htmlUrl });
      })
      .catch(() => {});
  }, []);

  return (
    <section className="px-4 py-4 sm:px-8 md:px-16 lg:px-24" style={{ background: "var(--rp-base)" }}>
      <div
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 rounded-xl border px-4 py-3 md:flex-row md:gap-4"
        style={{
          background: "var(--rp-surface)",
          borderColor: "var(--rp-highlight-med)",
        }}
      >
        {/* Clock */}
        <div
          className="flex shrink-0 items-center gap-2 text-base"
          style={{ color: "var(--rp-muted)" }}
        >
          <ClockIcon />
          <span style={{ color: textColor }}>{time || "—"}</span>
        </div>

        {/* Commit */}
        <div
          className="flex shrink-0 items-center gap-2 text-base transition-colors duration-200"
          style={{ color: "var(--rp-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = textColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--rp-muted)";
          }}
        >
          <CommitIcon />
          {commit ? (
            <a
              href={commit.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-base"
              style={{ color: "inherit" }}
            >
              {commit.shortSha}
            </a>
          ) : (
            <span className="font-mono text-base" style={{ color: "var(--rp-muted)" }}>
              ———
            </span>
          )}
        </div>

        {/* Spotify Player — centered, fills available space */}
        <div className="flex min-w-0 flex-1 justify-center">
          <div className="w-full max-w-[360px]">
            <SpotifyBox />
          </div>
        </div>

        {/* Page Views */}
        <div
          className="flex shrink-0 items-center gap-2 text-base"
          style={{ color: "var(--rp-subtle)" }}
        >
          <EyeIcon />
          <span>
            Page Views:{" "}
            <span style={{ color: "var(--rp-text)" }}>
              {views !== null ? views.toLocaleString() : "—"}
            </span>
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex shrink-0 items-center gap-3">
          {filteredSocials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="transition-colors duration-200"
              style={{ color: "var(--rp-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = textColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--rp-muted)";
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox={social.viewBox ?? "0 0 24 24"}
                fill="currentColor"
              >
                <path d={social.iconPath} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
