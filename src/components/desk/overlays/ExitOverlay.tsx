"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

export function ExitOverlay() {
  const router = useRouter();
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const activeModal = usePortfolioStore((s) => s.activeModal);
  const showExitConfirm = usePortfolioStore((s) => s.showExitConfirm);
  const setShowExitConfirm = usePortfolioStore((s) => s.setShowExitConfirm);
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);

  const showButton =
    (scenePhase === "desk" || scenePhase === "focused") && !activeModal;

  return (
    <>
      {/* Exit button — top right */}
      {showButton && !showExitConfirm && (
        <button
          onClick={() => setShowExitConfirm(true)}
          className="fixed top-4 right-4 z-40 px-4 py-2 rounded-xl border text-sm tracking-wider transition-opacity hover:opacity-80"
          style={{
            backgroundColor: palette.surface,
            borderColor: palette.highlightMed,
            color: palette.text,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          [EXIT]
        </button>
      )}

      {/* Confirmation dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-2xl border p-6 shadow-2xl flex flex-col items-center gap-5"
            style={{
              backgroundColor: palette.base,
              borderColor: palette.highlightMed,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <p className="text-base tracking-wider" style={{ color: palette.text }}>
              Return to home?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-2 rounded-xl border text-sm tracking-wider transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.highlightMed,
                  color: palette.subtle,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  router.push("/");
                }}
                className="px-5 py-2 rounded-xl border text-sm tracking-wider transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.highlightMed,
                  color: palette.love,
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
