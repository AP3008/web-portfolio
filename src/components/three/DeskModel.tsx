"use client";

import { useGLTF } from "@react-three/drei";
import { ASSETS } from "@/lib/constants";

export function DeskModel() {
  const { scene } = useGLTF(ASSETS.DESK_MODEL);

  return <primitive object={scene} position={[0, 0, 0]} scale={[1.3, 1.3, 1.3]} />;
}

useGLTF.preload(ASSETS.DESK_MODEL);
