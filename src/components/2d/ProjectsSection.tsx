"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { projects } from "@/components/desk/data/projects";
import {
  GITHUB_ICON_PATH,
  DEVPOST_ICON_PATH,
} from "@/components/desk/data/socials";
import type { CommitData } from "@/app/api/github-commits/route";

export function ProjectsSection() {
  const [latestByRepo, setLatestByRepo] = useState<Record<string, CommitData>>(
    {}
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const equalizeHeights = useCallback(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    // Reset to auto so we can measure natural heights
    cards.forEach((card) => (card.style.height = "auto"));
    const maxHeight = Math.max(...cards.map((card) => card.offsetHeight));
    cards.forEach((card) => (card.style.height = `${maxHeight}px`));
  }, []);

  useEffect(() => {
    fetch("/api/github-commits")
      .then((res) => res.json())
      .then((data) => {
        setLatestByRepo(data.latestByRepo ?? {});
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    equalizeHeights();

    const observer = new ResizeObserver(() => equalizeHeights());
    const grid = cardRefs.current[0]?.parentElement;
    if (grid) observer.observe(grid);

    return () => observer.disconnect();
  }, [latestByRepo, equalizeHeights]);

  return (
    <section
      className="flex min-h-screen flex-col items-center gap-8 px-4 py-16 sm:px-8 sm:py-24 md:px-16 lg:px-24"
    >
      <h2
        className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
        style={{ color: "var(--rp-text)" }}
      >
        All Projects
      </h2>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          const hasRepo = project.repoOwner && project.repoName;
          const commit = hasRepo
            ? latestByRepo[`${project.repoOwner}/${project.repoName}`]
            : undefined;

          return (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="flex h-full flex-col gap-3 rounded-xl border p-4 sm:gap-4 sm:p-6 lg:p-7"
              style={{
                background: "var(--rp-surface)",
                borderColor: "var(--rp-highlight-med)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className="text-lg font-semibold sm:text-xl"
                    style={{ color: "var(--rp-text)" }}
                  >
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: "var(--rp-muted)" }}
                    >
                      {project.subtitle}
                    </span>
                  )}
                  {project.award && (
                    <span
                      className="block text-xs font-semibold sm:text-sm"
                      style={{ color: "var(--rp-gold)" }}
                    >
                      {project.award}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasRepo && (
                    <a
                      href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-70"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="var(--rp-foam)"
                      >
                        <path d={GITHUB_ICON_PATH} />
                      </svg>
                    </a>
                  )}
                  {project.devpostUrl && (
                    <a
                      href={project.devpostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-70"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="var(--rp-foam)"
                      >
                        <path d={DEVPOST_ICON_PATH} />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--rp-subtle)" }}
              >
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded px-2 py-0.5 text-xs sm:px-2.5 sm:py-1 sm:text-sm"
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
                  className="mt-auto flex flex-col gap-2 border-t pt-3 text-xs sm:pt-4 sm:text-sm sm:flex-row sm:items-center sm:gap-3"
                  style={{ borderColor: "var(--rp-highlight-low)" }}
                >
                  <span style={{ color: "var(--rp-muted)" }}>
                    Latest commit
                  </span>
                  <a
                    href={commit.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate hover:underline"
                    style={{ color: "var(--rp-text)" }}
                  >
                    {commit.message}
                  </a>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" fill="var(--rp-foam)" />
                      </svg>
                      <span
                        className="rounded-md px-1.5 py-0.5 sm:px-2"
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
                      <span style={{ color: "#a6e3a1" }}>
                        +{commit.additions}
                      </span>
                      {" / "}
                      <span style={{ color: "#f38ba8" }}>
                        -{commit.deletions}
                      </span>
                    </span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
