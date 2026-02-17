"use client";

import { usePortfolioStore } from "@/store/usePortfolioStore";

export function TerminalLoader() {
  const percent = usePortfolioStore((s) => s.assetsLoadedPercent);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);

  if (scenePhase !== "loading") return null;

  const barWidth = 30;
  const filled = Math.round((percent / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = "|".repeat(filled) + "-".repeat(empty);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col gap-2 font-mono text-sm">
        <span className="text-accent">Loading Assets...</span>
        <span className="text-foreground">
          [{bar}] {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}
