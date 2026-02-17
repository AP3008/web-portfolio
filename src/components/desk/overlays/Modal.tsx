"use client";

import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

export function Modal({ children, onClose, title }: ModalProps) {
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
      <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded border border-border bg-surface p-6 font-mono text-foreground shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-bold tracking-wider text-accent">
            {">"} {title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-accent transition-colors text-sm tracking-wider"
          >
            [ESC]
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
