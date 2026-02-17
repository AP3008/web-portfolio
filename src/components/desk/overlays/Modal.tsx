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
    <>
      {/* ESC button — fixed to screen, outside the modal panel */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-60 text-text-muted hover:text-accent transition-colors text-sm font-mono tracking-wider"
      >
        [ESC]
      </button>

      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div className="h-[calc(100vh-6rem)] w-[calc(100vw-6rem)] max-w-350 overflow-y-auto rounded border border-border bg-surface p-5 font-mono text-foreground shadow-2xl">
          {children}
        </div>
      </div>
    </>
  );
}
