"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

const LONDON_ONTARIO: [number, number] = [42.9849, -81.2453];

// CARTO retired their keyless basemap tier and now stamps every unauthenticated
// tile with an "API KEY REQUIRED" watermark. Free key: https://carto.com/basemaps/apikey
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY;
const CARTO_DARK =
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png" +
  (CARTO_KEY ? `?key=${CARTO_KEY}` : "");

const OFF_CENTER_THRESHOLD = 0.01; // ~1 km

interface Props {
  recenterTrigger?: number;
  onOffCenter?: (offCenter: boolean) => void;
}

function MapController({ recenterTrigger, onOffCenter }: Props) {
  const map = useMap();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    map.flyTo(LONDON_ONTARIO, 12);
  }, [recenterTrigger, map]);

  useMapEvents({
    moveend() {
      const center = map.getCenter();
      const dist = Math.abs(center.lat - LONDON_ONTARIO[0]) + Math.abs(center.lng - LONDON_ONTARIO[1]);
      onOffCenter?.(dist > OFF_CENTER_THRESHOLD);
    },
  });

  return null;
}

export default function LeafletMapInner({ recenterTrigger, onOffCenter }: Props) {
  useEffect(() => {
    if (!CARTO_KEY && process.env.NODE_ENV === "development") {
      console.warn(
        "[LocationMap] NEXT_PUBLIC_CARTO_API_KEY is not set — CARTO will watermark every tile. " +
          "Get a free key at https://carto.com/basemaps/apikey and restart the dev server."
      );
    }
  }, []);

  return (
    <MapContainer
      center={LONDON_ONTARIO}
      zoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer url={CARTO_DARK} attribution="" subdomains="abcd" maxZoom={20} />
      <MapController recenterTrigger={recenterTrigger} onOffCenter={onOffCenter} />
    </MapContainer>
  );
}
