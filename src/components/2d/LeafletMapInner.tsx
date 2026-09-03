"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

const LONDON_ONTARIO: [number, number] = [42.9849, -81.2453];

// Esri World Dark Gray Canvas — keyless and unwatermarked. Note the {z}/{y}/{x}
// order, which is Esri's, not the {z}/{x}/{y} that most XYZ services use.
const ESRI_BASE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ESRI_LABELS =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION =
  '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, &copy; OpenStreetMap contributors';

// Esri stops serving real tiles past z16; upscale rather than go blank.
const MAX_NATIVE_ZOOM = 16;

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
  return (
    <MapContainer
      center={LONDON_ONTARIO}
      zoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url={ESRI_BASE}
        attribution={ESRI_ATTRIBUTION}
        maxNativeZoom={MAX_NATIVE_ZOOM}
        className="map-tiles-base"
      />
      <TileLayer url={ESRI_LABELS} maxNativeZoom={MAX_NATIVE_ZOOM} />
      <MapController recenterTrigger={recenterTrigger} onOffCenter={onOffCenter} />
    </MapContainer>
  );
}
