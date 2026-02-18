"use client";

import { useMemo } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS } from "@/lib/constants";

export function HoverHUD() {
  const hoveredObjectId = usePortfolioStore((s) => s.hoveredObjectId);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);

  const displayLabel = useMemo(() => {
    if (scenePhase !== "desk" || !hoveredObjectId) return null;
    const config = DESK_OBJECTS[hoveredObjectId];
    return config.hudLabel ?? null;
  }, [hoveredObjectId, scenePhase]);

  if (!displayLabel) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-background/80 border border-accent/30 px-4 py-1.5 rounded font-mono text-sm text-accent tracking-wider">
        {">"} DETECTED: {displayLabel}
      </div>
    </div>
  );
}
