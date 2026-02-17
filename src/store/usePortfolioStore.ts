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
  drawerOpen: boolean;

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
  toggleDrawer: () => void;
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
    drawerOpen: false,
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

    closeModal: () => {
      const { focusedObjectId } = get();
      // If we're focused on an object, closing modal returns to focus state
      // (user then presses ESC again or clicks background to return to desk)
      if (focusedObjectId) {
        set({ activeModal: null });
      } else {
        set({ activeModal: null, interactionsEnabled: true });
      }
    },

    setTerminalFocused: (focused) => set({ terminalFocused: focused }),

    toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),

    setQuality: (quality) => set({ quality }),
  })
);
