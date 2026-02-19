"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal } from "./Modal";
import { projects } from "../data/projects";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";
import type { CommitData } from "@/app/api/github-commits/route";

interface ProjectPortalModalProps {
  onClose: () => void;
}

export function ProjectPortalModal({ onClose }: ProjectPortalModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("Featured Projects", 80);

  const [commit, setCommit] = useState<CommitData | null>(null);

  useEffect(() => {
    fetch("/api/github-commits?repo=AP3008/web-portfolio")
      .then((res) => res.json())
      .then((data) => setCommit(data.commit ?? null))
      .catch(() => {});
  }, []);

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

        {/* Most Recent Commit section */}
        {commit && (
          <div>
            <h3 className="font-bold text-base mb-3" style={{ color: palette.text }}>
              Most Recent Commit:{" "}
              <span style={{ color: palette.foam }}>web-portfolio</span>
            </h3>
            <div
              className="rounded-xl border p-4 flex items-center gap-3 text-xs"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.highlightMed,
              }}
            >
              <a
                href={commit.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate flex-1 hover:underline text-sm"
                style={{ color: palette.text }}
              >
                {commit.message}
              </a>
              <span className="shrink-0 flex items-center gap-2">
                <span>
                  <span style={{ color: "#a6e3a1" }}>+{commit.additions}</span>
                  {" / "}
                  <span style={{ color: "#f38ba8" }}>-{commit.deletions}</span>
                </span>
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: palette.overlay,
                    color: palette.foam,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {commit.shortSha}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
