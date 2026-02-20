"use client";

import { useState, useEffect } from "react";
import { projects } from "@/components/desk/data/projects";
import type { CommitData } from "@/app/api/github-commits/route";

export function ProjectsSection() {
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

  return (
    <section
      className="flex min-h-screen flex-col items-center gap-10 px-8 py-24 md:px-16 lg:px-24"
    >
      <h2
        className="text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: "var(--rp-text)" }}
      >
        All Projects
      </h2>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const hasRepo = project.repoOwner && project.repoName;
          const commit = hasRepo
            ? latestByRepo[`${project.repoOwner}/${project.repoName}`]
            : undefined;

          return (
            <div
              key={project.id}
              className="flex h-full flex-col gap-3 rounded-xl border p-6"
              style={{
                background: "var(--rp-surface)",
                borderColor: "var(--rp-highlight-med)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--rp-text)" }}
                  >
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--rp-muted)" }}
                    >
                      {project.subtitle}
                    </span>
                  )}
                </div>
                {hasRepo && (
                  <a
                    href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs tracking-wider transition-colors duration-200"
                    style={{ color: "var(--rp-foam)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--rp-text)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--rp-foam)")
                    }
                  >
                    REPO →
                  </a>
                )}
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--rp-subtle)" }}
              >
                {project.description}
              </p>

              {/* Tech stack */}
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
                  className="mt-auto flex flex-col gap-2 border-t pt-3 text-xs sm:flex-row sm:items-center sm:gap-3"
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
