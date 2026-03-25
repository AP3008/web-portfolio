import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BrowseTimerState {
  totalSeconds: number;
  sessionStart: number;
  flush: () => void;
}

export const useBrowseTimerStore = create<BrowseTimerState>()(
  persist(
    (set, get) => ({
      totalSeconds: 0,
      sessionStart: Date.now(),
      flush: () => {
        const { sessionStart } = get();
        const sessionElapsed = Math.floor((Date.now() - sessionStart) / 1000);
        if (sessionElapsed > 0) {
          set((s) => ({
            totalSeconds: s.totalSeconds + sessionElapsed,
            sessionStart: Date.now(),
          }));
        }
      },
    }),
    {
      name: "browse-timer",
      partialize: (state) => ({ totalSeconds: state.totalSeconds }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.sessionStart = Date.now();
        }
      },
    }
  )
);
