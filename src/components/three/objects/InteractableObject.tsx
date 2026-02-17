"use client";

import { useRef, useCallback } from "react";
import { Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { DeskObjectId, DeskObjectConfig } from "@/lib/constants";

interface InteractableObjectProps {
  id: DeskObjectId;
  config: DeskObjectConfig;
  onClick?: () => void;
}

function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function InteractableObject({
  id,
  config,
  onClick,
}: InteractableObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const hoverObject = usePortfolioStore((s) => s.hoverObject);
  const interactionsEnabled = usePortfolioStore((s) => s.interactionsEnabled);
  const hoveredObjectId = usePortfolioStore((s) => s.hoveredObjectId);

  const isHovered = hoveredObjectId === id;

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (interactionsEnabled) {
        hoverObject(id);
        document.body.style.cursor = "pointer";
      }
    },
    [id, hoverObject, interactionsEnabled]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      hoverObject(null);
      document.body.style.cursor = "default";
    },
    [hoverObject]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (interactionsEnabled && onClick) {
        onClick();
      }
    },
    [interactionsEnabled, onClick]
  );

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {config.modelUrl ? (
        <GLBModel url={config.modelUrl} />
      ) : (
        <>
          <boxGeometry args={config.placeholderSize} />
          <meshStandardMaterial
            color={isHovered ? "#00ff88" : config.color}
            emissive={isHovered ? "#00ff88" : "#000000"}
            emissiveIntensity={isHovered ? 0.15 : 0}
          />
        </>
      )}
    </mesh>
  );
}
