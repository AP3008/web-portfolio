"use client";

import { Environment } from "@react-three/drei";
import { Color } from "three";
import { useAssetProgress } from "./loading/useAssetProgress";
import { RoomModel } from "./RoomModel";
import { DeskModel } from "./DeskModel";
import { Interactables } from "./Interactables";
import { CameraController } from "./camera/CameraController";
import { CameraRig } from "./camera/CameraRig";
import { usePerformanceMonitor } from "@/lib/perf";

const SKY_COLOR = new Color("#87CEEB");

export function SceneRoot() {
  useAssetProgress();
  usePerformanceMonitor();

  return (
    <>
      {/* Sky background visible through windows/gaps */}
      <color attach="background" args={[SKY_COLOR]} />

      {/* Lighting — daytime room */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} color="#fff5e6" />
      {/* Warm fill light simulating window daylight from the side */}
      <directionalLight position={[-3, 3, 4]} intensity={0.3} color="#ffe8cc" />

      {/* Environment for reflections */}
      <Environment preset="apartment" environmentIntensity={0.4} />

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
