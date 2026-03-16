"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal } from "./Modal";
import { projects } from "../data/projects";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";
import {
  GITHUB_ICON_PATH,
  DEVPOST_ICON_PATH,
} from "../data/socials";
import type { CommitData } from "@/app/api/github-commits/route";

interface ProjectPortalModalProps {
  onClose: () => void;
}

function CommitRow({
  commit,
  palette,
}: {
  commit: CommitData;
  palette: (typeof ROSE_PINE_PALETTES)[keyof typeof ROSE_PINE_PALETTES];
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <a
        href={commit.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate flex-1 hover:underline text-base"
        style={{ color: palette.text }}
      >
        {commit.message}
      </a>
      <span className="shrink-0 flex items-center gap-2">
        <span className="flex items-center gap-1.5">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="4" fill={palette.foam} />
          </svg>
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
        <span>
          <span style={{ color: "#a6e3a1" }}>+{commit.additions}</span>
          {" / "}
          <span style={{ color: "#f38ba8" }}>-{commit.deletions}</span>
        </span>
      </span>
    </div>
  );
}

export function ProjectPortalModal({ onClose }: ProjectPortalModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("Featured Projects", 80);

  const [latestByRepo, setLatestByRepo] = useState<Record<string, CommitData>>(
    {}
  );
  const [webPortfolioCommits, setWebPortfolioCommits] = useState<CommitData[]>(
    []
  );

  useEffect(() => {
    fetch("/api/github-commits")
      .then((res) => res.json())
      .then((data) => {
        setLatestByRepo(data.latestByRepo ?? {});
        setWebPortfolioCommits(data.webPortfolioCommits ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Title with typing effect */}
        <h2 className="text-3xl font-bold" style={{ color: palette.text }}>
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
        {projects.map((project) => {
          const repoKey = `${project.repoOwner}/${project.repoName}`;
          const commit = latestByRepo[repoKey];

          return (
            <div
              key={project.id}
              className="rounded-xl border p-4 transition-colors"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.highlightMed,
              }}
            >
              {/* Header: title + GitHub icon */}
              <div className="flex items-center justify-between mb-1">
                <h3
                  className="text-lg font-bold"
                  style={{ color: palette.text }}
                >
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://github.com/${repoKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    title={repoKey}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill={palette.foam}
                    >
                      <path d={GITHUB_ICON_PATH} />
                    </svg>
                  </a>
                  {project.devpostUrl && (
                    <a
                      href={project.devpostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                      title="DevPost"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill={palette.foam}
                      >
                        <path d={DEVPOST_ICON_PATH} />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className="text-base mb-2 leading-relaxed"
                style={{ color: palette.subtle }}
              >
                {project.description}
              </p>

              {/* Subtitle */}
              {project.subtitle && (
                <p
                  className="text-sm mb-1"
                  style={{ color: palette.muted }}
                >
                  {project.subtitle}
                </p>
              )}

              {/* Award */}
              {project.award && (
                <p
                  className="text-sm mb-3 font-semibold"
                  style={{ color: palette.gold }}
                >
                  {project.award}
                </p>
              )}

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border px-2.5 py-1 text-sm"
                    style={{
                      borderColor: palette.highlightMed,
                      color: palette.iris,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Latest commit for this project */}
              {commit && (
                <div
                  className="border-t pt-3"
                  style={{ borderColor: palette.highlightMed }}
                >
                  <CommitRow commit={commit} palette={palette} />
                </div>
              )}
            </div>
          );
        })}

        {/* web-portfolio commits section */}
        {webPortfolioCommits.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3">
              <a
                href="https://github.com/AP3008/web-portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: palette.foam }}
              >
                web-portfolio: AP3008
              </a>
            </h3>
            <div className="flex flex-col gap-2">
              {webPortfolioCommits.map((c) => (
                <div
                  key={c.sha}
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.highlightMed,
                  }}
                >
                  <CommitRow commit={c} palette={palette} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
