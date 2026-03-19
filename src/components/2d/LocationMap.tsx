"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[200px] w-full animate-pulse rounded-lg"
      style={{ background: "var(--rp-overlay)" }}
    />
  ),
});

export function LocationMap() {
  return <LeafletMap />;
}
