"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DEFAULT_CAMERA_TARGET } from "@/lib/constants";
import { Vector3 } from "three";

const _lookTarget = new Vector3(...DEFAULT_CAMERA_TARGET);

/**
 * Mouse-as-eyes: subtly offsets camera lookAt based on cursor position.
 * Only active when scenePhase === 'desk' and not terminal-focused.
 */
export function CameraRig() {
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const terminalFocused = usePortfolioStore((s) => s.terminalFocused);
  const offsetRef = useRef({ x: 0, y: 0 });

  useFrame(({ camera, pointer }) => {
    if (scenePhase !== "desk" || terminalFocused) return;

    const amplitude = 0.08;
    const targetX = pointer.x * amplitude;
    const targetY = pointer.y * amplitude * 0.5;

    offsetRef.current.x += (targetX - offsetRef.current.x) * 0.05;
    offsetRef.current.y += (targetY - offsetRef.current.y) * 0.05;

    // Offset the lookAt target instead of mutating camera rotation directly
    _lookTarget.set(
      DEFAULT_CAMERA_TARGET[0] + offsetRef.current.x,
      DEFAULT_CAMERA_TARGET[1] + offsetRef.current.y,
      DEFAULT_CAMERA_TARGET[2]
    );
    camera.lookAt(_lookTarget);
  });

  return null;
}
