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

interface LocationMapProps {
  recenterTrigger?: number;
  onOffCenter?: (offCenter: boolean) => void;
}

export function LocationMap({ recenterTrigger, onOffCenter }: LocationMapProps) {
  return <LeafletMap recenterTrigger={recenterTrigger} onOffCenter={onOffCenter} />;
}
