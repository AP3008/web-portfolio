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

const BIO_LINKS: Record<string, { label: string; url: string }> = {
  "{savify}": { label: "Savify", url: "https://savify.ca" },
  "{findmyprof}": { label: "FindMyProf", url: "https://github.com/garv130/FindMyProf" },
  "{reflecta}": { label: "Reflecta", url: "https://github.com/adit1110/Reflecta" },
};

function renderBioLine(
  text: string,
  palette: (typeof ROSE_PINE_PALETTES)[keyof typeof ROSE_PINE_PALETTES]
) {
  const tokenPattern = /(\{savify\}|\{findmyprof\}|\{reflecta\})/g;
  const parts = text.split(tokenPattern);

  return (
    <>
      {parts.map((part, i) => {
        const link = BIO_LINKS[part];
        if (link) {
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2 hover:decoration-2"
              style={{ color: palette.foam }}
            >
              {link.label}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function AboutModal({ onClose }: AboutModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("About Me", 80);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-8">
        {/* Title with typing effect */}
        <h2 className="text-4xl font-bold" style={{ color: palette.text }}>
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
        <div className="flex items-center gap-6">
          <img
            src="/adam_drawing.png"
            alt="Adam Porbanderwalla"
            className="w-36 h-36 rounded-full object-cover border-2"
            style={{ borderColor: palette.highlightMed }}
          />
          <h3 className="text-2xl font-bold" style={{ color: palette.text }}>
            {aboutData.name}
          </h3>
        </div>

        {/* Bio paragraphs */}
        <div className="flex flex-col gap-5">
          {aboutData.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed"
              style={{ color: palette.subtle }}
            >
              {renderBioLine(paragraph, palette)}
            </p>
          ))}
        </div>

        {/* Contact links */}
        <div className="flex items-center gap-5">
          {aboutData.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full border transition-opacity hover:opacity-80"
              style={{ borderColor: palette.highlightMed }}
              title={link.label}
            >
              <svg
                viewBox={link.viewBox ?? "0 0 24 24"}
                className="w-6 h-6"
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
