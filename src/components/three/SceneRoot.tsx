"use client";

import { Environment } from "@react-three/drei";
import { useAssetProgress } from "./loading/useAssetProgress";
import { RoomModel } from "./RoomModel";
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
      {/* Lighting — dark developer room */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 4, 1]} intensity={0.4} />

      {/* Environment for reflections */}
      <Environment preset="night" environmentIntensity={0.2} />

      {/* Camera systems */}
      <CameraController />
      <CameraRig />

      {/* Room environment */}
      <RoomModel />

      {/* Desk model */}
      <DeskModel />

      {/* Interactive objects */}
      <Interactables />
    </>
  );
}
