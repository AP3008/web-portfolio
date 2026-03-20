"use client";

import { useState, useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import type { SpotifyTrack } from "@/app/api/spotify/route";

type State =
  | { status: "loading" }
  | { status: "loaded"; track: SpotifyTrack }
  | { status: "error" };

export function SpotifyBox() {
  const [state, setState] = useState<State>({ status: "loading" });
  const variant = useThemeStore((s) => s.variant);

  useEffect(() => {
    fetch("/api/spotify")
      .then((res) => {
        if (!res.ok) throw new Error("non-2xx");
        return res.json() as Promise<SpotifyTrack>;
      })
      .then((track) => setState({ status: "loaded", track }))
      .catch(() => setState({ status: "error" }));
  }, []);

  const spotifyTheme = variant === "dawn" ? "1" : "0";

  if (state.status === "loading") {
    return (
      <div
        className="h-20 w-full animate-pulse rounded-lg"
        style={{ background: "var(--rp-overlay)" }}
      />
    );
  }

  if (state.status === "error") {
    return (
      <span
        className="text-2xl font-bold"
        style={{ color: "var(--rp-muted)" }}
      >
        —
      </span>
    );
  }

  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${state.track.trackId}?utm_source=generator&theme=${spotifyTheme}`}
      width="100%"
      height="80"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{
        borderRadius: "0.5rem",
        border: "none",
      }}
    />
  );
}
