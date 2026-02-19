"use client";

import { useMemo } from "react";
import { Modal } from "./Modal";
import { aboutData } from "../data/about";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("About Me", 80);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Title with typing effect */}
        <h2 className="text-2xl font-bold" style={{ color: palette.text }}>
          {title}
          <span
            className="inline-block w-[2px] h-[1.1em] ml-1 align-middle"
            style={{
              backgroundColor: palette.text,
              animation: "blink-cursor 1.06s step-end infinite",
            }}
          />
        </h2>

        <div>
          <h3 className="text-xl font-bold mb-1" style={{ color: palette.text }}>
            {aboutData.name}
          </h3>
          <p className="text-sm" style={{ color: palette.gold }}>
            GPA: {aboutData.gpa}
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: palette.subtle }}>
          {aboutData.bio}
        </p>

        <div>
          <h4
            className="text-sm font-bold mb-3 tracking-wider"
            style={{ color: palette.muted }}
          >
            TECH STACK
          </h4>
          <div className="flex flex-wrap gap-2">
            {aboutData.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border px-3 py-1 text-xs"
                style={{
                  borderColor: palette.highlightMed,
                  color: palette.iris,
                }}
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
