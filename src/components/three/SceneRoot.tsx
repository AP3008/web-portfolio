"use client";

import { Environment } from "@react-three/drei";
import { useAssetProgress } from "./loading/useAssetProgress";
import { DeskModel } from "./DeskModel";
import { Interactables } from "./Interactables";
import { CameraController } from "./camera/CameraController";
import { CameraRig } from "./camera/CameraRig";
import { usePerformanceMonitor } from "@/lib/perf";

export function SceneRoot() {
  useAssetProgress();
  usePerformanceMonitor();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />

      {/* Environment for reflections */}
      <Environment preset="city" environmentIntensity={0.3} />

      {/* Camera systems */}
      <CameraController />
      <CameraRig />

      {/* Desk model */}
      <DeskModel />

      {/* Interactive objects */}
      <Interactables />
    </>
  );
}
