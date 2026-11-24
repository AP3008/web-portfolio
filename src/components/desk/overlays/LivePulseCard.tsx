"use client";

import { useEffect, useState } from "react";
import type { LivePulse } from "@/lib/whoop";
import type { RosePinePalette } from "@/lib/themes";

interface LivePulseCardProps {
  palette: RosePinePalette;
  textColor: string;
}

const HEVY_URL = "https://hevy.com/user/adamp3008";
const HEVY_LABEL = "Full workout log on Hevy ↗";

function recoveryColor(p: RosePinePalette, recovery: number) {
  return recovery >= 67 ? p.foam : recovery >= 34 ? p.gold : p.love;
}

// Parse "YYYY-MM-DD" as a local date so the Whoop day doesn't shift with the visitor's timezone.
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const fmt = (v: number | null | undefined, suffix = "") =>
  v == null ? "—" : `${v}${suffix}`;

export function LivePulseCard({ palette: p, textColor }: LivePulseCardProps) {
  const [data, setData] = useState<LivePulse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/whoop", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`/api/whoop ${res.status}`);
        return res.json() as Promise<LivePulse>;
      })
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  if (failed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pb-12">
        <a
          href={HEVY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl px-8 py-3 text-base transition-opacity hover:opacity-80"
          style={{ backgroundColor: p.overlay, color: p.iris }}
        >
          {HEVY_LABEL}
        </a>
      </div>
    );
  }

  const bars = [
    { label: "Day strain", value: data?.strain, max: 21, shown: fmt(data?.strain), color: p.pine },
    {
      label: "Sleep performance",
      value: data?.sleepPerformance,
      max: 100,
      shown: fmt(data?.sleepPerformance, "%"),
      color: p.iris,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center pb-12">
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: p.highlightMed }}
      >
        <div
          className="flex items-center gap-2 px-8 pt-6 text-sm"
          style={{ backgroundColor: p.surface, color: p.subtle }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: p.foam }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: p.foam }}
            />
          </span>
          Live data from Whoop
        </div>

        <div
          className="grid grid-cols-[auto_1fr] gap-10 p-8"
          style={{ backgroundColor: p.surface }}
        >
          <div className="flex flex-col justify-center">
            <span className="text-sm uppercase tracking-widest" style={{ color: p.muted }}>
              Recovery
            </span>
            <span
              className="text-8xl font-bold leading-none"
              style={{ color: data ? recoveryColor(p, data.recovery) : p.muted }}
            >
              {data ? data.recovery : "—"}
              {data && <span className="text-4xl">%</span>}
            </span>
            <span className="text-sm mt-2" style={{ color: p.subtle }}>
              {data ? formatDate(data.date) : "—"}
            </span>
          </div>

          <div className="flex flex-col justify-center gap-5">
            {bars.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1.5">
                  <span style={{ color: p.subtle }}>{s.label}</span>
                  <span className="font-bold" style={{ color: textColor }}>
                    {s.shown}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: p.highlightMed }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${s.value == null ? 0 : (s.value / s.max) * 100}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={HEVY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-8 py-3 text-base transition-opacity hover:opacity-80"
          style={{ backgroundColor: p.overlay, color: p.iris }}
        >
          {HEVY_LABEL}
        </a>
      </div>
    </div>
  );
}
