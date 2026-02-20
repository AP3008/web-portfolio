"use client";

import { useProgress } from "@react-three/drei";
import { useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/**
 * Syncs drei's useProgress with the Zustand store.
 * Must be called inside a component within the R3F Canvas tree.
 */
export function useAssetProgress() {
  const { progress } = useProgress();
  const setAssetsLoaded = usePortfolioStore((s) => s.setAssetsLoaded);
  const setScenePhase = usePortfolioStore((s) => s.setScenePhase);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const terminalAnimDone = usePortfolioStore((s) => s.terminalAnimDone);

  useEffect(() => {
    setAssetsLoaded(progress);
  }, [progress, setAssetsLoaded]);

  // Only transition to desk when both assets are loaded AND terminal animation is done
  useEffect(() => {
    if (progress >= 100 && terminalAnimDone && scenePhase === "loading") {
      const timer = setTimeout(() => {
        setScenePhase("desk");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, terminalAnimDone, scenePhase, setScenePhase]);

  return progress;
}
