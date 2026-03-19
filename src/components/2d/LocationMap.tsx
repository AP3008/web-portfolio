"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full animate-pulse rounded-lg"
      style={{ background: "var(--rp-overlay)" }}
    />
  ),
});

export function LocationMap() {
  return <LeafletMap />;
}
