import { create } from "zustand";

import type { SpotifyTrack } from "@/app/api/spotify/route";

interface SpotifyState {
  status: "idle" | "loading" | "loaded" | "error";
  track: SpotifyTrack | null;
  fetchTrack: () => void;
}

export const useSpotifyStore = create<SpotifyState>((set, get) => ({
  status: "idle",
  track: null,
  fetchTrack: () => {
    const { status } = get();
    if (status === "loading" || status === "loaded") return;
    set({ status: "loading" });
    fetch("/api/spotify")
      .then((res) => {
        if (!res.ok) throw new Error("non-2xx");
        return res.json() as Promise<SpotifyTrack>;
      })
      .then((track) => set({ status: "loaded", track }))
      .catch(() => set({ status: "error" }));
  },
}));
