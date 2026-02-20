"use client";

import { useCallback, useEffect, useRef, useMemo } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  // Prevent scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* ESC button — fixed to screen, outside the modal panel */}
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

      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div
          className="h-[calc(100vh-6rem)] w-[calc(100vw-6rem)] max-w-350 overflow-y-auto rounded-2xl border p-8 shadow-2xl text-base"
          style={{
            backgroundColor: palette.base,
            borderColor: palette.highlightMed,
            color: palette.text,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
