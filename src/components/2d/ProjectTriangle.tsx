"use client";

import { useState, useEffect } from "react";
import { projects, type Project } from "@/components/desk/data/projects";
import type { CommitData } from "@/app/api/github-commits/route";

// Define the triangle order: top, bottom-left, bottom-right
const TRIANGLE_ORDER = ["findmyprof", "reflecta", "learningtofly"] as const;

function FlipCard({
  project,
  isRevealed,
  onClick,
  commit,
}: {
  project: Project;
  isRevealed: boolean;
  onClick: () => void;
  commit?: CommitData;
}) {
  const hasRepo = project.repoOwner && project.repoName;

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 400, height: 400, perspective: "900px" }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — cover (hidden state) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border"
          style={{
            backfaceVisibility: "hidden",
            background: "var(--rp-overlay)",
            borderColor: "var(--rp-highlight-med)",
          }}
        >
          <span
            className="text-4xl font-bold"
            style={{ color: "var(--rp-muted)" }}
          >
            ?
          </span>
          <span
            className="text-xs tracking-wider"
            style={{ color: "var(--rp-muted)" }}
          >
            CLICK TO REVEAL
          </span>
        </div>

        {/* Back — revealed content */}
        <div
          className="absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-xl border p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--rp-surface)",
            borderColor: "var(--rp-highlight-med)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--rp-text)" }}
              >
                {project.title}
              </h3>
              <span
                className="text-xs"
                style={{ color: "var(--rp-muted)" }}
              >
                {project.subtitle}
              </span>
            </div>
            {hasRepo && (
              <a
                href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs tracking-wider transition-colors duration-200"
                style={{ color: "var(--rp-foam)" }}
                onClick={(e) => e.stopPropagation()}
              >
                REPO →
              </a>
            )}
          </div>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--rp-subtle)" }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded px-2 py-0.5 text-xs"
                style={{
                  background: "var(--rp-overlay)",
                  color: "var(--rp-iris)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Latest commit */}
          {commit && (
            <div
              className="mt-auto flex flex-col gap-2 border-t pt-3 text-xs"
              style={{ borderColor: "var(--rp-highlight-low)" }}
            >
              <span
                className="text-xs"
                style={{ color: "var(--rp-muted)" }}
              >
                Latest commit
              </span>
              <a
                href={commit.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline"
                style={{ color: "var(--rp-text)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {commit.message}
              </a>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" fill="var(--rp-foam)" />
                  </svg>
                  <span
                    className="rounded-md px-1.5 py-0.5"
                    style={{
                      backgroundColor: "var(--rp-overlay)",
                      color: "var(--rp-foam)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {commit.shortSha}
                  </span>
                </span>
                <span>
                  <span style={{ color: "#a6e3a1" }}>+{commit.additions}</span>
                  {" / "}
                  <span style={{ color: "#f38ba8" }}>-{commit.deletions}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectTriangle() {
  const [revealedId, setRevealedId] = useState<string>("findmyprof");
  const [latestByRepo, setLatestByRepo] = useState<Record<string, CommitData>>(
    {}
  );

  useEffect(() => {
    fetch("/api/github-commits")
      .then((res) => res.json())
      .then((data) => {
        setLatestByRepo(data.latestByRepo ?? {});
      })
      .catch(() => {});
  }, []);

  const orderedProjects = TRIANGLE_ORDER.map(
    (id) => projects.find((p) => p.id === id)!
  );

  const handleClick = (id: string) => {
    setRevealedId(id);
  };

  const [top, bottomLeft, bottomRight] = orderedProjects;

  const getCommit = (project: Project) => {
    if (!project.repoOwner || !project.repoName) return undefined;
    return latestByRepo[`${project.repoOwner}/${project.repoName}`];
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Top card */}
      <FlipCard
        project={top}
        isRevealed={revealedId === top.id}
        onClick={() => handleClick(top.id)}
        commit={getCommit(top)}
      />

      {/* Bottom row */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <FlipCard
          project={bottomLeft}
          isRevealed={revealedId === bottomLeft.id}
          onClick={() => handleClick(bottomLeft.id)}
          commit={getCommit(bottomLeft)}
        />
        <FlipCard
          project={bottomRight}
          isRevealed={revealedId === bottomRight.id}
          onClick={() => handleClick(bottomRight.id)}
          commit={getCommit(bottomRight)}
        />
      </div>
    </div>
  );
}
