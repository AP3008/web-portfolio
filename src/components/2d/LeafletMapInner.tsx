"use client";

import { MapContainer, TileLayer } from "react-leaflet";

const LONDON_ONTARIO: [number, number] = [42.9849, -81.2453];
const CARTO_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export default function LeafletMapInner() {
  return (
    <MapContainer
      center={LONDON_ONTARIO}
      zoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer url={CARTO_DARK} attribution="" />
    </MapContainer>
  );
}
