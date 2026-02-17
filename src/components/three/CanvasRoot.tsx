"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { SceneRoot } from "./SceneRoot";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DEFAULT_CAMERA_POSITION } from "@/lib/constants";

const DPR_MAP = {
  high: [1, 1.5] as [number, number],
  medium: [1, 1.25] as [number, number],
  low: [0.75, 1] as [number, number],
};

export function CanvasRoot() {
  const quality = usePortfolioStore((s) => s.quality);

  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={DPR_MAP[quality]}
        gl={{
          antialias: quality !== "low",
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 50,
          near: 0.1,
          far: 100,
          position: DEFAULT_CAMERA_POSITION,
        }}
      >
        <SceneRoot />
        <Preload all />
      </Canvas>
    </div>
  );
}
