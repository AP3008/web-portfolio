"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "./Modal";
import { projects } from "../data/projects";
import type { CommitData } from "@/app/api/github-commits/route";

interface ProjectPortalModalProps {
  onClose: () => void;
}

function DiffBlock({ patch }: { patch: string }) {
  const lines = patch.split("\n");
  return (
    <pre className="text-xs leading-relaxed overflow-x-auto">
      {lines.map((line, i) => {
        let color = "text-text-muted";
        if (line.startsWith("+") && !line.startsWith("+++")) color = "text-green-400";
        else if (line.startsWith("-") && !line.startsWith("---")) color = "text-red-400";
        else if (line.startsWith("@@")) color = "text-blue-400";
        return (
          <div key={i} className={color}>
            {line}
          </div>
        );
      })}
    </pre>
  );
}

function CommitRow({ commit }: { commit: CommitData }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(commit.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2.5 hover:bg-surface-hover transition-colors flex items-center gap-3"
      >
        <a
          href={commit.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-accent font-mono text-xs hover:underline shrink-0"
        >
          {commit.shortSha}
        </a>
        <span className="text-foreground text-sm truncate flex-1">
          {commit.message}
        </span>
        <span className="text-xs shrink-0">
          <span className="text-green-400">+{commit.additions}</span>
          {" "}
          <span className="text-red-400">-{commit.deletions}</span>
        </span>
        <span className="text-text-muted text-xs shrink-0">{date}</span>
        <svg
          viewBox="0 0 24 24"
          className={`w-3 h-3 fill-none stroke-text-muted shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {expanded && commit.files.length > 0 && (
        <div className="bg-[#0d0d0d] border-t border-border/30 px-3 py-2 flex flex-col gap-2">
          {commit.files.map((file) => (
            <div key={file.filename}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-foreground text-xs font-mono truncate">
                  {file.filename}
                </span>
                <span className="text-xs shrink-0">
                  <span className="text-green-400">+{file.additions}</span>
                  {" "}
                  <span className="text-red-400">-{file.deletions}</span>
                </span>
              </div>
              {file.patch && <DiffBlock patch={file.patch} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectPortalModal({ onClose }: ProjectPortalModalProps) {
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommits = useCallback(async () => {
    try {
      const res = await fetch("/api/github-commits");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCommits(data.commits ?? []);
    } catch {
      setError("Could not load recent commits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommits();
  }, [fetchCommits]);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Project cards */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded border border-border p-4 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-foreground">
                {project.title}
              </h3>
              <a
                href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-mono"
              >
                {project.repoOwner}/{project.repoName}
              </a>
            </div>
            <p className="text-sm text-text-muted mb-3 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-accent/20 px-2 py-0.5 text-xs text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Recent Activity */}
        <div>
          <h3 className="text-foreground font-bold text-base mb-3">
            Recent Activity
          </h3>
          <div className="rounded border border-border overflow-hidden">
            {loading && (
              <div className="px-3 py-4 text-text-muted text-sm text-center">
                Loading commits...
              </div>
            )}
            {error && (
              <div className="px-3 py-4 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {!loading && !error && commits.length === 0 && (
              <div className="px-3 py-4 text-text-muted text-sm text-center">
                No recent commits found
              </div>
            )}
            {commits.map((commit) => (
              <CommitRow key={commit.sha} commit={commit} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
