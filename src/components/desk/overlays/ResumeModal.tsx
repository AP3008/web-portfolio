"use client";

import { useCallback, useEffect, useMemo } from "react";
import { resumeData } from "../data/resume";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

interface ResumeModalProps {
  onClose: () => void;
}

export function ResumeModal({ onClose }: ResumeModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <>
      {/* ESC button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-60 transition-colors text-sm tracking-wider"
        style={{
          color: palette.muted,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        [ESC]
      </button>

      {/* Backdrop with blur */}
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm"
      >
        {/* PDF viewer */}
        <div
          className="rounded-2xl border overflow-hidden shadow-2xl"
          style={{ borderColor: palette.highlightMed }}
        >
          <iframe
            src={resumeData.pdfUrl}
            title="Resume PDF"
            className="w-[calc(100vw-8rem)] max-w-3xl h-[75vh] border-0"
          />
        </div>

        {/* Download button */}
        <a
          href={resumeData.pdfUrl}
          download
          className="rounded-xl px-6 py-2 text-sm tracking-wider transition-opacity hover:opacity-80"
          style={{
            backgroundColor: palette.overlay,
            color: palette.iris,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          DOWNLOAD PDF
        </a>
      </div>
    </>
  );
}
