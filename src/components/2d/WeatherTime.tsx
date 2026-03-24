"use client";

import { useState, useEffect } from "react";

type Condition = "clear" | "clouds" | "rain" | "snow" | "thunderstorm" | "drizzle" | "mist";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function RainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="13" x2="16" y2="21" />
      <line x1="8" y1="13" x2="8" y2="21" />
      <line x1="12" y1="15" x2="12" y2="23" />
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    </svg>
  );
}

function SnowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
      <line x1="8" y1="16" x2="8.01" y2="16" />
      <line x1="8" y1="20" x2="8.01" y2="20" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
      <line x1="12" y1="22" x2="12.01" y2="22" />
      <line x1="16" y1="16" x2="16.01" y2="16" />
      <line x1="16" y1="20" x2="16.01" y2="20" />
    </svg>
  );
}

function StormIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
      <polyline points="13 11 9 17 15 17 11 23" />
    </svg>
  );
}

function MistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="7" y1="16" x2="17" y2="16" />
    </svg>
  );
}

function WeatherIcon({ condition, isDay }: { condition: Condition; isDay: boolean }) {
  switch (condition) {
    case "clear":
      return isDay ? <SunIcon /> : <MoonIcon />;
    case "clouds":
      return <CloudIcon />;
    case "rain":
    case "drizzle":
      return <RainIcon />;
    case "snow":
      return <SnowIcon />;
    case "thunderstorm":
      return <StormIcon />;
    case "mist":
      return <MistIcon />;
    default:
      return <CloudIcon />;
  }
}

export function WeatherTime() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState<{ condition: Condition; isDay: boolean } | null>(null);

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-CA", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => {});
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 text-sm tracking-widest"
      style={{ color: "var(--rp-muted)" }}
    >
      {weather && <WeatherIcon condition={weather.condition} isDay={weather.isDay} />}
      <span>{time || "—"}</span>
    </div>
  );
}
