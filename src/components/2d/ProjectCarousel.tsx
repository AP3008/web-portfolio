"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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

const CARD_COUNT = DUMMY_PROJECTS.length;
const ANGLE_STEP = 360 / CARD_COUNT;
const RADIUS = 320;
const AUTO_SPEED = 0.15; // degrees per frame

export function ProjectCarousel() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);

  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const lastPointerX = useRef(0);
  const lastTimestamp = useRef(0);
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Continuous animation loop: auto-rotate or apply momentum
  const animate = useCallback(() => {
    setRotation((prev) => {
      if (isDragging) return prev;
      return prev + (velocity !== 0 ? velocity : AUTO_SPEED);
    });

    // Decay velocity (momentum after drag)
    if (!isDragging && velocity !== 0) {
      setVelocity((v) => {
        const decayed = v * 0.96;
        return Math.abs(decayed) < 0.01 ? 0 : decayed;
      });
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isDragging, velocity]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate]);

  // Pointer handlers for drag
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      setVelocity(0);
      dragStartX.current = e.clientX;
      dragStartRotation.current = rotation;
      lastPointerX.current = e.clientX;
      lastTimestamp.current = performance.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [rotation]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX.current;
      const sensitivity = 0.3;
      setRotation(dragStartRotation.current + dx * sensitivity);

      // Track velocity for momentum
      const now = performance.now();
      const dt = now - lastTimestamp.current;
      if (dt > 0) {
        const pointerDx = e.clientX - lastPointerX.current;
        setVelocity((pointerDx / dt) * 16 * sensitivity);
      }
      lastPointerX.current = e.clientX;
      lastTimestamp.current = now;
    },
    [isDragging]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none"
      style={{
        width: "100%",
        maxWidth: "700px",
        height: "340px",
        perspective: "1000px",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
          transition: isDragging ? "none" : undefined,
        }}
      >
        {DUMMY_PROJECTS.map((project, i) => {
          const angle = i * ANGLE_STEP;
          return (
            <div
              key={project.name}
              className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <div
                className="flex flex-col gap-3 rounded-xl border p-5"
                style={{
                  background: "var(--rp-surface)",
                  borderColor: "var(--rp-highlight-med)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-base font-semibold"
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
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    REPO →
                  </a>
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

                <div
                  className="flex items-center gap-2 border-t pt-2.5 text-xs"
                  style={{ borderColor: "var(--rp-highlight-low)" }}
                >
                  <span style={{ color: "var(--rp-muted)" }}>Latest:</span>
                  <span style={{ color: "var(--rp-subtle)" }}>
                    {project.latestCommit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
