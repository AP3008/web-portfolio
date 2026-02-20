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

function renderBioLine(
  text: string,
  palette: (typeof ROSE_PINE_PALETTES)[keyof typeof ROSE_PINE_PALETTES]
) {
  const parts = text.split("{savify}");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <a
        href="https://savify.ca"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
        style={{ color: palette.foam }}
      >
        Savify
      </a>
      {parts[1]}
    </>
  );
}

export function AboutModal({ onClose }: AboutModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("About Me", 80);

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

        {/* Profile image + name */}
        <div className="flex items-center gap-5">
          <img
            src="/adam_drawing.png"
            alt="Adam Porbanderwalla"
            className="w-24 h-24 rounded-full object-cover border-2"
            style={{ borderColor: palette.highlightMed }}
          />
          <h3 className="text-xl font-bold" style={{ color: palette.text }}>
            {aboutData.name}
          </h3>
        </div>

        {/* Bio paragraphs */}
        <div className="flex flex-col gap-4">
          {aboutData.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed"
              style={{ color: palette.subtle }}
            >
              {renderBioLine(paragraph, palette)}
            </p>
          ))}
        </div>

        {/* Contact links */}
        <div className="flex items-center gap-4">
          {aboutData.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border transition-opacity hover:opacity-80"
              style={{ borderColor: palette.highlightMed }}
              title={link.label}
            >
              <svg
                viewBox={link.viewBox ?? "0 0 24 24"}
                className="w-5 h-5"
                fill={palette.iris}
              >
                <path d={link.iconPath} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}
