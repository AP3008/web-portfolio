"use client";

import { useCallback } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS, type DeskObjectId } from "@/lib/constants";
import { InteractableObject } from "./objects/InteractableObject";

export function Interactables() {
  const focusObject = usePortfolioStore((s) => s.focusObject);
  const openModal = usePortfolioStore((s) => s.openModal);
  const setTerminalFocused = usePortfolioStore((s) => s.setTerminalFocused);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);

  const handleObjectClick = useCallback(
    (id: DeskObjectId) => {
      if (scenePhase !== "desk") return;

      const config = DESK_OBJECTS[id];

      if (id === "monitor") {
        focusObject(id);
        setTerminalFocused(true);
        return;
      }

      focusObject(id);
      if (config.modal) {
        openModal(config.modal);
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
