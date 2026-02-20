"use client";

import { useState } from "react";
import { projects, type Project } from "@/components/desk/data/projects";

// Define the triangle order: top, bottom-left, bottom-right
const TRIANGLE_ORDER = ["findmyprof", "reflecta", "placeholder"] as const;

function FlipCard({
  project,
  isRevealed,
  onClick,
}: {
  project: Project;
  isRevealed: boolean;
  onClick: () => void;
}) {
  const hasRepo = project.repoOwner && project.repoName;

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 280, height: 260, perspective: "800px" }}
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
            className="text-3xl font-bold"
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
          className="absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-xl border p-5"
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
                className="text-base font-semibold"
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
            className="text-xs leading-relaxed"
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
        </div>
      </div>
    </div>
  );
}

export function ProjectTriangle() {
  const [revealedId, setRevealedId] = useState<string>("findmyprof");

  const orderedProjects = TRIANGLE_ORDER.map(
    (id) => projects.find((p) => p.id === id)!
  );

  const handleClick = (id: string) => {
    setRevealedId(id);
  };

  const [top, bottomLeft, bottomRight] = orderedProjects;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Top card */}
      <FlipCard
        project={top}
        isRevealed={revealedId === top.id}
        onClick={() => handleClick(top.id)}
      />

      {/* Bottom row */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <FlipCard
          project={bottomLeft}
          isRevealed={revealedId === bottomLeft.id}
          onClick={() => handleClick(bottomLeft.id)}
        />
        <FlipCard
          project={bottomRight}
          isRevealed={revealedId === bottomRight.id}
          onClick={() => handleClick(bottomRight.id)}
        />
      </div>
    </div>
  );
}
