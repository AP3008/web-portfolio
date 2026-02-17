"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import gsap from "gsap";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import {
  DESK_OBJECTS,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_TARGET,
  DURATIONS,
} from "@/lib/constants";

/**
 * Reacts to store focusedObjectId changes and animates camera with GSAP.
 * Must be placed inside the R3F Canvas tree.
 */
export function CameraController() {
  const { camera } = useThree();
  const focusedObjectId = usePortfolioStore((s) => s.focusedObjectId);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lookAtTarget = useRef(new Vector3(...DEFAULT_CAMERA_TARGET));

  useEffect(() => {
    // Kill any running timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (scenePhase === "focused" && focusedObjectId) {
      const config = DESK_OBJECTS[focusedObjectId];
      const targetPos = config.cameraPosition;
      const targetLookAt = config.cameraTarget;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Animate camera position
      tl.to(camera.position, {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration: DURATIONS.CAMERA_FOCUS,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(lookAtTarget.current);
        },
      });

      // Animate lookAt target in parallel
      tl.to(
        lookAtTarget.current,
        {
          x: targetLookAt[0],
          y: targetLookAt[1],
          z: targetLookAt[2],
          duration: DURATIONS.CAMERA_FOCUS,
          ease: "power2.inOut",
        },
        0
      );
    } else if (scenePhase === "desk") {
      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(camera.position, {
        x: DEFAULT_CAMERA_POSITION[0],
        y: DEFAULT_CAMERA_POSITION[1],
        z: DEFAULT_CAMERA_POSITION[2],
        duration: DURATIONS.CAMERA_RETURN,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(lookAtTarget.current);
        },
      });

      tl.to(
        lookAtTarget.current,
        {
          x: DEFAULT_CAMERA_TARGET[0],
          y: DEFAULT_CAMERA_TARGET[1],
          z: DEFAULT_CAMERA_TARGET[2],
          duration: DURATIONS.CAMERA_RETURN,
          ease: "power2.inOut",
        },
        0
      );
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [focusedObjectId, scenePhase, camera]);

  return null;
}
