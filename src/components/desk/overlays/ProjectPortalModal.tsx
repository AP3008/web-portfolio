"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal } from "./Modal";
import { projects } from "../data/projects";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES, type RosePinePalette } from "@/lib/themes";
import type { CommitData } from "@/app/api/github-commits/route";

interface ProjectPortalModalProps {
  onClose: () => void;
}

function DiffBlock({ patch }: { patch: string }) {
  const lines = patch.split("\n");
  return (
    <pre className="text-xs leading-relaxed overflow-x-auto">
      {lines.map((line, i) => {
        let color = "";
        if (line.startsWith("+") && !line.startsWith("+++")) color = "#a6e3a1";
        else if (line.startsWith("-") && !line.startsWith("---")) color = "#f38ba8";
        else if (line.startsWith("@@")) color = "#89b4fa";
        return (
          <div key={i} style={{ color: color || undefined }}>
            {line}
          </div>
        );
      })}
    </pre>
  );
}

function CommitRow({ commit, palette }: { commit: CommitData; palette: RosePinePalette }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(commit.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div style={{ borderBottomColor: palette.highlightLow }} className="border-b last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2.5 transition-colors flex items-center gap-3"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.overlay)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <a
          href={commit.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs hover:underline shrink-0"
          style={{ color: palette.foam, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {commit.shortSha}
        </a>
        <span className="text-sm truncate flex-1" style={{ color: palette.text }}>
          {commit.message}
        </span>
        <span className="text-xs shrink-0">
          <span style={{ color: "#a6e3a1" }}>+{commit.additions}</span>
          {" "}
          <span style={{ color: "#f38ba8" }}>-{commit.deletions}</span>
        </span>
        <span className="text-xs shrink-0" style={{ color: palette.muted }}>{date}</span>
        <svg
          viewBox="0 0 24 24"
          className={`w-3 h-3 fill-none shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
          stroke={palette.muted}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {expanded && commit.files.length > 0 && (
        <div
          className="border-t px-3 py-2 flex flex-col gap-2"
          style={{
            backgroundColor: palette.highlightLow,
            borderColor: palette.highlightMed,
          }}
        >
          {commit.files.map((file) => (
            <div key={file.filename}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs truncate"
                  style={{ color: palette.text, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {file.filename}
                </span>
                <span className="text-xs shrink-0">
                  <span style={{ color: "#a6e3a1" }}>+{file.additions}</span>
                  {" "}
                  <span style={{ color: "#f38ba8" }}>-{file.deletions}</span>
                </span>
              </div>
              {file.patch && <DiffBlock patch={file.patch} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectPortalModal({ onClose }: ProjectPortalModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("Projects", 80);

  const [commits, setCommits] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommits = useCallback(async () => {
    try {
      const res = await fetch("/api/github-commits");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCommits(data.commits ?? []);
    } catch {
      setError("Could not load recent commits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommits();
  }, [fetchCommits]);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Title with typing effect */}
        <h2 className="text-2xl font-bold" style={{ color: palette.text }}>
          {title}
          <span
            className="inline-block w-[2px] h-[1.1em] ml-1 align-middle"
            style={{
              backgroundColor: palette.text,
              animation: "blink-cursor 1.06s step-end infinite",
            }}
          />
        </h2>

        {/* Project cards */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border p-4 transition-colors"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.highlightMed,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold" style={{ color: palette.text }}>
                {project.title}
              </h3>
              <a
                href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: palette.foam, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {project.repoOwner}/{project.repoName}
              </a>
            </div>
            <p className="text-sm mb-3 leading-relaxed" style={{ color: palette.subtle }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border px-2 py-0.5 text-xs"
                  style={{
                    borderColor: palette.highlightMed,
                    color: palette.iris,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Recent Activity */}
        <div>
          <h3 className="font-bold text-base mb-3" style={{ color: palette.text }}>
            Recent Activity
          </h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: palette.highlightMed }}
          >
            {loading && (
              <div className="px-3 py-4 text-sm text-center" style={{ color: palette.muted }}>
                Loading commits...
              </div>
            )}
            {error && (
              <div className="px-3 py-4 text-sm text-center" style={{ color: palette.love }}>
                {error}
              </div>
            )}
            {!loading && !error && commits.length === 0 && (
              <div className="px-3 py-4 text-sm text-center" style={{ color: palette.muted }}>
                No recent commits found
              </div>
            )}
            {commits.map((commit) => (
              <CommitRow key={commit.sha} commit={commit} palette={palette} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
