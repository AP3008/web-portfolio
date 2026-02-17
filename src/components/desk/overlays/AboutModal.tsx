"use client";

import { Modal } from "./Modal";
import { aboutData } from "../data/about";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {aboutData.name}
          </h3>
          <p className="text-sm text-accent">GPA: {aboutData.gpa}</p>
        </div>

        <p className="text-sm text-text-muted leading-relaxed">
          {aboutData.bio}
        </p>

        <div>
          <h4 className="text-sm font-bold text-foreground mb-3 tracking-wider">
            TECH STACK
          </h4>
          <div className="flex flex-wrap gap-2">
            {aboutData.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-accent/20 px-3 py-1 text-xs text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
