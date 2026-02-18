"use client";

import { useGLTF } from "@react-three/drei";
import { ASSETS } from "@/lib/constants";

export function RoomModel() {
  const { scene } = useGLTF(ASSETS.ROOM_MODEL);

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
      scale={[2, 2, 2]}
      rotation={[0, 0, 0]}
    />
  );
}

useGLTF.preload(ASSETS.ROOM_MODEL);
