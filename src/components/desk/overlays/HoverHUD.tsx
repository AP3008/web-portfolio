"use client";

import { useMemo } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS } from "@/lib/constants";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

export function HoverHUD() {
  const hoveredObjectId = usePortfolioStore((s) => s.hoveredObjectId);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);

  const displayLabel = useMemo(() => {
    if (scenePhase !== "desk" || !hoveredObjectId) return null;
    const config = DESK_OBJECTS[hoveredObjectId];
    return config.hudLabel ?? null;
  }, [hoveredObjectId, scenePhase]);

  if (!displayLabel) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div
        className="px-5 py-2 rounded-xl text-sm tracking-wider"
        style={{
          backgroundColor: palette.surface,
          borderWidth: 1,
          borderColor: palette.highlightMed,
          color: palette.iris,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {displayLabel}
      </div>
    </div>
  );
}
