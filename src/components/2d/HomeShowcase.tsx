"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/components/desk/data/projects";
import type { CommitData } from "@/app/api/github-commits/route";

function DuolingoStreak({ streak }: { streak: number | null }) {
  const digits = streak !== null ? String(streak).split("") : [];

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border"
      style={{
        background: "var(--rp-surface)",
        borderColor: "var(--rp-highlight-med)",
        width: "min(88vw, 430px)",
        height: "min(88vw, 430px)",
      }}
    >
      {/* Subtle radial glow behind the number */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, var(--rp-overlay) 0%, transparent 70%)",
        }}
      />

      {streak !== null ? (
        <div className="relative flex flex-col items-center gap-5">
          {/* Duo icon */}
          <Image src="/duo.svg" alt="Duo" width={72} height={72} className="h-16 w-16 sm:h-18 sm:w-18" />

          {/* Streak digits in individual boxes */}
          <div className="flex items-center gap-2 sm:gap-3">
            {digits.map((d, i) => (
              <span
                key={i}
                className="flex items-center justify-center rounded-lg text-4xl font-bold tabular-nums sm:text-5xl"
                style={{
                  width: "3.2rem",
                  height: "4rem",
                  background: "var(--rp-overlay)",
                  color: "var(--rp-gold)",
                  borderBottom: "3px solid var(--rp-gold)",
                }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Label */}
          <span
            className="text-xs tracking-widest uppercase sm:text-sm"
            style={{ color: "var(--rp-muted)" }}
          >
            Day Duolingo Streak
          </span>

          {/* Progress bar accent */}
          <div
            className="h-1 rounded-full"
            style={{
              width: "60%",
              background: `linear-gradient(90deg, var(--rp-gold), var(--rp-love))`,
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Image src="/duo.svg" alt="Duo" width={56} height={56} className="h-14 w-14" />
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="animate-pulse rounded-lg"
                style={{
                  width: "3.2rem",
                  height: "4rem",
                  background: "var(--rp-overlay)",
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--rp-muted)" }}
          >
            Loading streak...
          </span>
        </div>
      )}
    </div>
  );
}

function RandomFlipCard({
  project,
  isFlipped,
  onClick,
  commit,
}: {
  project: Project | null;
  isFlipped: boolean;
  onClick: () => void;
  commit?: CommitData;
}) {
  const hasRepo = project?.repoOwner && project?.repoName;

  return (
    <div
      className="relative cursor-pointer"
      style={{
        width: "min(88vw, 430px)",
        height: "min(88vw, 430px)",
        perspective: "900px",
      }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — prompt */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border"
          style={{
            backfaceVisibility: "hidden",
            background: "var(--rp-overlay)",
            borderColor: "var(--rp-highlight-med)",
          }}
        >
          <span
            className="text-4xl font-bold sm:text-5xl"
            style={{ color: "var(--rp-muted)" }}
          >
            ?
          </span>
          <span
            className="px-4 text-center text-sm tracking-wider sm:text-base"
            style={{ color: "var(--rp-muted)" }}
          >
            Check out a random project
          </span>
          <span
            className="text-xs tracking-wider sm:text-sm"
            style={{ color: "var(--rp-highlight-high)" }}
          >
            CLICK TO DISCOVER
          </span>
        </div>

        {/* Back — project content */}
        <div
          className="absolute inset-0 flex flex-col gap-3 overflow-y-auto rounded-xl border p-4 sm:gap-4 sm:overflow-hidden sm:p-7"
          style={{
            maxHeight: "min(88vw, 430px)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--rp-surface)",
            borderColor: "var(--rp-highlight-med)",
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {project && (
            <>
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
                </div>
                {hasRepo && (
                  <a
                    href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs tracking-wider transition-colors duration-200 sm:text-sm"
                    style={{ color: "var(--rp-foam)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    REPO →
                  </a>
                )}
              </div>

              <p
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--rp-subtle)" }}
              >
                {project.description}
              </p>

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

              {commit && (
                <div
                  className="mt-auto flex flex-col gap-2 border-t pt-3 text-xs sm:pt-4 sm:text-sm"
                  style={{ borderColor: "var(--rp-highlight-low)" }}
                >
                  <span
                    className="text-xs sm:text-sm"
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
                  </div>
                </div>
              )}

              <span
                className="mt-auto text-center text-xs tracking-wider"
                style={{ color: "var(--rp-muted)" }}
              >
                Click for another →
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomeShowcase() {
  const [streak, setStreak] = useState<number | null>(null);
  const [latestByRepo, setLatestByRepo] = useState<
    Record<string, CommitData>
  >({});
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const pickNextProject = useCallback(
    (seen: Set<string>) => {
      let available = projects.filter((p) => !seen.has(p.id));
      if (available.length === 0) {
        setSeenIds(new Set());
        available = projects;
      }
      const pick = available[Math.floor(Math.random() * available.length)];
      setSeenIds((prev) => new Set(prev).add(pick.id));
      setCurrentProject(pick);
    },
    [],
  );

  useEffect(() => {
    pickNextProject(seenIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("/api/duolingo-streak")
      .then((res) => res.json())
      .then((data) => setStreak(data.streak ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/github-commits")
      .then((res) => res.json())
      .then((data) => setLatestByRepo(data.latestByRepo ?? {}))
      .catch(() => {});
  }, []);

  const handleCardClick = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        pickNextProject(seenIds);
      }, 500);
    } else {
      setIsFlipped(true);
    }
  };

  const commit =
    currentProject?.repoOwner && currentProject?.repoName
      ? latestByRepo[
          `${currentProject.repoOwner}/${currentProject.repoName}`
        ]
      : undefined;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="grid w-full max-w-[920px] grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-2">
        <DuolingoStreak streak={streak} />
        <RandomFlipCard
          project={currentProject}
          isFlipped={isFlipped}
          onClick={handleCardClick}
          commit={commit}
        />
      </div>
      <Link
        href="/2d/projects"
        className="text-xs tracking-wider transition-colors duration-200 sm:text-sm"
        style={{ color: "var(--rp-subtle)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--rp-iris)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--rp-subtle)";
        }}
      >
        VIEW ALL PROJECTS →
      </Link>
    </div>
  );
}
