"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ThemePicker } from "@/components/gate/ThemePicker";
import { LocationMap } from "./LocationMap";
import { ColourMatrix } from "./ColourMatrix";

function PaletteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125C12.99 18.975 13 18.482 13 18c0-1.105.895-2 2-2h1.148C19.1 16 21 14.1 21 11.724 21 6.313 17.016 2 12 2z" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BoxTitle({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div
      className="mb-4 flex items-center gap-2 text-sm uppercase tracking-widest"
      style={{ color: "var(--rp-muted)" }}
    >
      {icon}
      {label}
    </div>
  );
}

const boxStyle: React.CSSProperties = {
  background: "var(--rp-surface)",
  borderColor: "var(--rp-highlight-med)",
};

export function InfoSection() {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16 md:px-16 lg:px-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {/* Three-box row */}
        <div className="flex flex-wrap gap-4">
          {/* Theme */}
          <div className="rounded-xl border p-4 sm:p-6" style={boxStyle}>
            <BoxTitle icon={<PaletteIcon />} label="Theme" />
            <ThemePicker mode="compact" />
          </div>

          {/* Currently Living In */}
          <div
            className="flex min-w-[280px] flex-1 flex-col rounded-xl border p-4 sm:p-6"
            style={boxStyle}
          >
            <BoxTitle icon={<LocationPinIcon />} label="Living In | London, ON, Canada" />
            <div className="min-h-[200px] flex-1 overflow-hidden rounded-lg">
              {mapReady ? (
                <LocationMap />
              ) : (
                <div
                  className="h-full w-full animate-pulse rounded-lg"
                  style={{ background: "var(--rp-overlay)" }}
                />
              )}
            </div>
          </div>

          {/* Colour Matrix */}
          <div
            className="flex min-w-[280px] flex-1 flex-col rounded-xl border p-4 sm:p-6"
            style={boxStyle}
          >
            <ColourMatrix />
          </div>
        </div>
      </div>
    </section>
  );
}
