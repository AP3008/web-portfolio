"use client";

import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const FPS_SAMPLE_SIZE = 60;
const LOW_FPS_THRESHOLD = 35;
const RECOVER_FPS_THRESHOLD = 50;

/**
 * Measures FPS and auto-adjusts quality setting.
 * Must be called inside the R3F Canvas tree.
 */
export function usePerformanceMonitor() {
  const setQuality = usePortfolioStore((s) => s.setQuality);
  const quality = usePortfolioStore((s) => s.quality);
  const frameTimes = useRef<number[]>([]);
  const lastCheck = useRef(0);

  const checkPerformance = useCallback(
    (avgFps: number) => {
      if (avgFps < LOW_FPS_THRESHOLD && quality !== "low") {
        setQuality("low");
      } else if (avgFps >= RECOVER_FPS_THRESHOLD && quality === "low") {
        setQuality("medium");
      }
    },
    [quality, setQuality]
  );

  useFrame((_, delta) => {
    const fps = 1 / delta;
    frameTimes.current.push(fps);

    if (frameTimes.current.length >= FPS_SAMPLE_SIZE) {
      const avg =
        frameTimes.current.reduce((a, b) => a + b, 0) /
        frameTimes.current.length;
      frameTimes.current = [];

      const now = performance.now();
      // Only check every 2 seconds to avoid thrashing
      if (now - lastCheck.current > 2000) {
        lastCheck.current = now;
        checkPerformance(avg);
      }
    }
  });
}
