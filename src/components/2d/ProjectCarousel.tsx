"use client";

import { useState, useEffect, useCallback } from "react";

interface CarouselProject {
  name: string;
  description: string;
  techStack: string[];
  repo: string;
  latestCommit: string;
}

const DUMMY_PROJECTS: CarouselProject[] = [
  {
    name: "3D Portfolio",
    description:
      "An immersive 3D portfolio built with React Three Fiber, featuring interactive desk objects, GSAP camera animations, and a functional terminal interface.",
    techStack: ["Next.js", "React Three Fiber", "TypeScript", "GSAP"],
    repo: "https://github.com/AP3008/web-portfolio",
    latestCommit: "feat: added phone, updated chess pieces",
  },
  {
    name: "Project Alpha",
    description:
      "A full-stack web application with real-time data processing and an intuitive dashboard interface.",
    techStack: ["React", "Node.js", "PostgreSQL", "WebSocket"],
    repo: "#",
    latestCommit: "fix: resolved websocket reconnection bug",
  },
  {
    name: "Project Beta",
    description:
      "A high-performance REST API with intelligent caching, rate limiting, and comprehensive monitoring.",
    techStack: ["Python", "FastAPI", "Redis", "Docker"],
    repo: "#",
    latestCommit: "chore: updated dependencies",
  },
  {
    name: "Project Gamma",
    description:
      "A native mobile application with offline-first architecture and seamless cloud sync.",
    techStack: ["Swift", "SwiftUI", "CoreData", "CloudKit"],
    repo: "#",
    latestCommit: "feat: added dark mode support",
  },
];

const AUTO_ROTATE_MS = 4000;

export function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = DUMMY_PROJECTS.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [paused, next]);

  const project = DUMMY_PROJECTS[current];

  return (
    <div
      className="flex flex-col items-center gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div className="relative flex w-full max-w-xl items-center gap-4">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="shrink-0 rounded-full p-2 transition-colors duration-200"
          style={{ color: "var(--rp-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-muted)")}
          aria-label="Previous project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Card content */}
        <div
          className="flex flex-1 flex-col gap-4 rounded-xl border p-6"
          style={{
            background: "var(--rp-surface)",
            borderColor: "var(--rp-highlight-med)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--rp-text)" }}
            >
              {project.name}
            </h3>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs tracking-wider transition-colors duration-200"
              style={{ color: "var(--rp-foam)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-foam)")}
            >
              REPO →
            </a>
          </div>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--rp-subtle)" }}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
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
          <div
            className="flex items-center gap-2 border-t pt-3 text-xs"
            style={{ borderColor: "var(--rp-highlight-low)" }}
          >
            <span style={{ color: "var(--rp-muted)" }}>Latest:</span>
            <span style={{ color: "var(--rp-subtle)" }}>
              {project.latestCommit}
            </span>
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="shrink-0 rounded-full p-2 transition-colors duration-200"
          style={{ color: "var(--rp-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-muted)")}
          aria-label="Next project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2">
        {DUMMY_PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              background:
                i === current ? "var(--rp-iris)" : "var(--rp-highlight-high)",
            }}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
