"use client";

import { useState, useEffect, useCallback } from "react";
import { CanvasRoot } from "@/components/three/CanvasRoot";
import { TerminalLoader } from "@/components/gate/TerminalLoader";
import { HoverHUD } from "@/components/desk/overlays/HoverHUD";
import { ModalManager } from "@/components/desk/overlays/ModalManager";
import { TerminalOverlay } from "@/components/desk/overlays/TerminalOverlay";
import { ExitOverlay } from "@/components/desk/overlays/ExitOverlay";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function DeskExperience() {
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const setScenePhase = usePortfolioStore((s) => s.setScenePhase);
  const activeModal = usePortfolioStore((s) => s.activeModal);
  const closeModal = usePortfolioStore((s) => s.closeModal);
  const returnToDesk = usePortfolioStore((s) => s.returnToDesk);
  const terminalFocused = usePortfolioStore((s) => s.terminalFocused);
  const setTerminalFocused = usePortfolioStore((s) => s.setTerminalFocused);
  const showExitConfirm = usePortfolioStore((s) => s.showExitConfirm);
  const setShowExitConfirm = usePortfolioStore((s) => s.setShowExitConfirm);

  // Defer canvas mount so typing animation gets a head start
  const [canvasReady, setCanvasReady] = useState(false);

  // Transition from gate to loading when this component mounts
  useEffect(() => {
    if (scenePhase === "gate") {
      setScenePhase("loading");
    }
  }, [scenePhase, setScenePhase]);

  // Mount the heavy 3D canvas after a short delay so the typing animation runs smoothly
  useEffect(() => {
    const timer = setTimeout(() => setCanvasReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // ESC key handler with priority: modal > focus > terminal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeModal) {
          closeModal();
        } else if (showExitConfirm) {
          setShowExitConfirm(false);
        } else if (scenePhase === "focused") {
          returnToDesk();
        } else if (terminalFocused) {
          setTerminalFocused(false);
        } else if (scenePhase === "desk") {
          setShowExitConfirm(true);
        }
      }
    },
    [activeModal, showExitConfirm, scenePhase, terminalFocused, closeModal, returnToDesk, setTerminalFocused, setShowExitConfirm]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {canvasReady && <CanvasRoot />}
      <TerminalLoader />
      <HoverHUD />
      <ModalManager />
      <TerminalOverlay />
      <ExitOverlay />
    </>
  );
}
