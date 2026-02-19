import { create } from "zustand";
import type {
  DeskObjectId,
  ModalType,
  ScenePhase,
} from "@/lib/constants";

export interface PortfolioState {
  // Scene
  scenePhase: ScenePhase;
  assetsLoadedPercent: number;

  // Interaction
  hoveredObjectId: DeskObjectId | null;
  focusedObjectId: DeskObjectId | null;
  activeModal: ModalType;
  interactionsEnabled: boolean;
  terminalFocused: boolean;
  showExitConfirm: boolean;

  // Performance
  quality: "high" | "medium" | "low";
}

export interface PortfolioActions {
  setScenePhase: (phase: ScenePhase) => void;
  setAssetsLoaded: (percent: number) => void;

  hoverObject: (id: DeskObjectId | null) => void;
  focusObject: (id: DeskObjectId) => void;
  returnToDesk: () => void;

  openModal: (modal: NonNullable<ModalType>) => void;
  closeModal: () => void;

  setTerminalFocused: (focused: boolean) => void;
  setShowExitConfirm: (show: boolean) => void;
  setQuality: (quality: PortfolioState["quality"]) => void;
}

export const usePortfolioStore = create<PortfolioState & PortfolioActions>()(
  (set, get) => ({
    // Initial state
    scenePhase: "gate",
    assetsLoadedPercent: 0,
    hoveredObjectId: null,
    focusedObjectId: null,
    activeModal: null,
    interactionsEnabled: false,
    terminalFocused: false,
    showExitConfirm: false,
    quality: "high",

    // Actions
    setScenePhase: (phase) =>
      set({
        scenePhase: phase,
        interactionsEnabled: phase === "desk",
        // Clear hover/focus when returning to non-desk phases
        ...(phase !== "focused" && phase !== "desk"
          ? { hoveredObjectId: null, focusedObjectId: null, activeModal: null }
          : {}),
      }),

    setAssetsLoaded: (percent) => set({ assetsLoadedPercent: percent }),

    hoverObject: (id) => {
      if (!get().interactionsEnabled) return;
      set({ hoveredObjectId: id });
    },

    focusObject: (id) =>
      set({
        focusedObjectId: id,
        scenePhase: "focused",
        interactionsEnabled: false,
        hoveredObjectId: null,
      }),

    returnToDesk: () =>
      set({
        focusedObjectId: null,
        activeModal: null,
        scenePhase: "desk",
        interactionsEnabled: true,
        terminalFocused: false,
        hoveredObjectId: null,
      }),

    openModal: (modal) =>
      set({
        activeModal: modal,
        interactionsEnabled: false,
      }),

    closeModal: () =>
      set({
        activeModal: null,
        focusedObjectId: null,
        scenePhase: "desk",
        interactionsEnabled: true,
        terminalFocused: false,
        hoveredObjectId: null,
      }),

    setTerminalFocused: (focused) => set({ terminalFocused: focused }),
    setShowExitConfirm: (show) => set({ showExitConfirm: show }),

    setQuality: (quality) => set({ quality }),
  })
);
