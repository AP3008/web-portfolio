"use client";

import { Modal } from "./Modal";
import { projects } from "../data/projects";

interface ProjectPortalModalProps {
  onClose: () => void;
}

export function ProjectPortalModal({ onClose }: ProjectPortalModalProps) {
  return (
    <Modal title="PROJECTS" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded border border-border p-4 hover:border-accent/40 transition-colors"
          >
            <h3 className="text-base font-bold text-foreground mb-1">
              {project.title}
            </h3>
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
      </div>
    </Modal>
  );
}
