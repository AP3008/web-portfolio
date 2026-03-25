"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { useSpotifyStore } from "@/store/useSpotifyStore";

export function SpotifyBox() {
  const { status, track, fetchTrack } = useSpotifyStore();
  const variant = useThemeStore((s) => s.variant);

  useEffect(() => {
    fetchTrack();
  }, [fetchTrack]);

  const spotifyTheme = variant === "dawn" ? "1" : "0";

  if (status === "idle" || status === "loading") {
    return (
      <div
        className="h-20 w-full animate-pulse rounded-lg"
        style={{ background: "var(--rp-overlay)" }}
      />
    );
  }

  if (status === "error" || !track) {
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
      src={`https://open.spotify.com/embed/track/${track.trackId}?utm_source=generator&theme=${spotifyTheme}`}
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
