"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal } from "./Modal";
import { projects, type Project } from "../data/projects";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES, type RosePinePalette } from "@/lib/themes";
import type { CommitData } from "@/app/api/github-commits/route";

interface ProjectPortalModalProps {
  onClose: () => void;
}

function LatestCommit({ project, palette }: { project: Project; palette: RosePinePalette }) {
  const [commit, setCommit] = useState<CommitData | null>(null);

  useEffect(() => {
    fetch(`/api/github-commits?repo=${project.repoOwner}/${project.repoName}`)
      .then((res) => res.json())
      .then((data) => setCommit(data.commit ?? null))
      .catch(() => {});
  }, [project.repoOwner, project.repoName]);

  if (!commit) return null;

  return (
    <div
      className="mt-3 pt-3 border-t flex items-center gap-2 text-xs"
      style={{ borderColor: palette.highlightLow }}
    >
      <span style={{ color: palette.foam }}>{project.repoName}:</span>
      <a
        href={commit.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate flex-1 hover:underline"
        style={{ color: palette.text }}
      >
        {commit.message}
      </a>
      <span className="shrink-0" style={{ color: palette.muted }}>
        <span style={{ color: "#a6e3a1" }}>+{commit.additions}</span>
        {" / "}
        <span style={{ color: "#f38ba8" }}>-{commit.deletions}</span>
      </span>
    </div>
  );
}

export function ProjectPortalModal({ onClose }: ProjectPortalModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("Projects", 80);

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

            {/* Latest commit row */}
            <LatestCommit project={project} palette={palette} />
          </div>
        ))}
      </div>
    </Modal>
  );
}
