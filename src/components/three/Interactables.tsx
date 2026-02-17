"use client";

import { useCallback } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS, DURATIONS, type DeskObjectId } from "@/lib/constants";
import { InteractableObject } from "./objects/InteractableObject";

const MODAL_DELAY_MS = DURATIONS.CAMERA_FOCUS * 1000;

export function Interactables() {
  const focusObject = usePortfolioStore((s) => s.focusObject);
  const openModal = usePortfolioStore((s) => s.openModal);
  const setTerminalFocused = usePortfolioStore((s) => s.setTerminalFocused);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);

  const handleObjectClick = useCallback(
    (id: DeskObjectId) => {
      if (scenePhase !== "desk") return;

      const config = DESK_OBJECTS[id];
      focusObject(id);

      if (id === "monitor") {
        setTimeout(() => setTerminalFocused(true), MODAL_DELAY_MS);
        return;
      }

      if (config.modal) {
        setTimeout(() => openModal(config.modal), MODAL_DELAY_MS);
      }
    },
    [scenePhase, focusObject, openModal, setTerminalFocused]
  );

  return (
    <group>
      {(Object.entries(DESK_OBJECTS) as [DeskObjectId, typeof DESK_OBJECTS[DeskObjectId]][]).map(
        ([id, config]) => (
          <InteractableObject
            key={id}
            id={id}
            config={config}
            onClick={() => handleObjectClick(id)}
          />
        )
      )}
    </group>
  );
}
