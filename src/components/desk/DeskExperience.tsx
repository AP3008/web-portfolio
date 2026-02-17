"use client";

import { useEffect, useCallback } from "react";
import { CanvasRoot } from "@/components/three/CanvasRoot";
import { TerminalLoader } from "@/components/gate/TerminalLoader";
import { HoverHUD } from "@/components/desk/overlays/HoverHUD";
import { ModalManager } from "@/components/desk/overlays/ModalManager";
import { TerminalOverlay } from "@/components/desk/overlays/TerminalOverlay";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function DeskExperience() {
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const setScenePhase = usePortfolioStore((s) => s.setScenePhase);
  const activeModal = usePortfolioStore((s) => s.activeModal);
  const closeModal = usePortfolioStore((s) => s.closeModal);
  const returnToDesk = usePortfolioStore((s) => s.returnToDesk);
  const terminalFocused = usePortfolioStore((s) => s.terminalFocused);
  const setTerminalFocused = usePortfolioStore((s) => s.setTerminalFocused);

  // Transition from gate to loading when this component mounts
  useEffect(() => {
    if (scenePhase === "gate") {
      setScenePhase("loading");
    }
  }, [scenePhase, setScenePhase]);

  // ESC key handler with priority: modal > focus > terminal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeModal) {
          closeModal();
        } else if (scenePhase === "focused") {
          returnToDesk();
        } else if (terminalFocused) {
          setTerminalFocused(false);
        }
      }
    },
    [activeModal, scenePhase, terminalFocused, closeModal, returnToDesk, setTerminalFocused]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <CanvasRoot />
      <TerminalLoader />
      <HoverHUD />
      <ModalManager />
      <TerminalOverlay />
    </>
  );
}
