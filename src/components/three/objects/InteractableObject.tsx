"use client";

import { useRef, useCallback, useEffect, useMemo } from "react";
import { Group, Mesh, MeshStandardMaterial, Color } from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS, type DeskObjectId, type DeskObjectConfig } from "@/lib/constants";

interface InteractableObjectProps {
  id: DeskObjectId;
  config: DeskObjectConfig;
  onClick?: () => void;
}

const HOVER_EMISSIVE = new Color("#00ff88");
const DEFAULT_EMISSIVE = new Color("#000000");

function GLBModel({ url, isHovered, scale }: { url: string; isHovered: boolean; scale?: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material = child.material.clone();
        child.material.emissive = isHovered ? HOVER_EMISSIVE : DEFAULT_EMISSIVE;
        child.material.emissiveIntensity = isHovered ? 0.15 : 0;
      }
    });
  }, [cloned, isHovered]);

  return <primitive object={cloned} scale={scale} />;
}

export function InteractableObject({
  id,
  config,
  onClick,
}: InteractableObjectProps) {
  const groupRef = useRef<Group>(null);
  const hoverObject = usePortfolioStore((s) => s.hoverObject);
  const interactionsEnabled = usePortfolioStore((s) => s.interactionsEnabled);
  const hoveredObjectId = usePortfolioStore((s) => s.hoveredObjectId);

  const isInteractive = config.interactive !== false;

  const isHovered = hoveredObjectId === id ||
    (hoveredObjectId !== null && config.linkedHoverId === hoveredObjectId);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (interactionsEnabled && isInteractive) {
        hoverObject(id);
        document.body.style.cursor = "pointer";
      }
    },
    [id, hoverObject, interactionsEnabled, isInteractive]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (isInteractive) {
        hoverObject(null);
        document.body.style.cursor = "default";
      }
    },
    [hoverObject, isInteractive]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (interactionsEnabled && isInteractive && onClick) {
        onClick();
      }
    },
    [interactionsEnabled, isInteractive, onClick]
  );

  return (
    <group
      ref={groupRef}
      position={config.position}
      rotation={config.rotation}
      onPointerOver={isInteractive ? handlePointerOver : undefined}
      onPointerOut={isInteractive ? handlePointerOut : undefined}
      onClick={isInteractive ? handleClick : undefined}
    >
      {config.modelUrl ? (
        <GLBModel url={config.modelUrl} isHovered={isHovered} scale={config.scale} />
      ) : (
        <mesh>
          <boxGeometry args={config.placeholderSize} />
          <meshStandardMaterial
            color={isHovered ? "#00ff88" : config.color}
            emissive={isHovered ? "#00ff88" : "#000000"}
            emissiveIntensity={isHovered ? 0.15 : 0}
          />
        </mesh>
      )}
    </group>
  );
}

// Preload all GLB models
for (const config of Object.values(DESK_OBJECTS)) {
  if (config.modelUrl) {
    useGLTF.preload(config.modelUrl);
  }
}
