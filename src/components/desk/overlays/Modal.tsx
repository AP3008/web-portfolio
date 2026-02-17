"use client";

import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded border border-border bg-surface p-5 font-mono text-foreground shadow-2xl">
        {/* Floating ESC button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-text-muted hover:text-accent transition-colors text-xs tracking-wider"
        >
          [ESC]
        </button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
