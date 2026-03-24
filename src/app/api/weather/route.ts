import { NextResponse } from "next/server";

// London, Ontario coordinates
const LAT = 42.9849;
const LON = -81.2453;

// WMO weather codes → simple condition
function wmoToCondition(code: number): string {
  if (code === 0) return "clear";
  if (code <= 3) return "clouds";
  if (code >= 45 && code <= 48) return "mist";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return "clouds";
}

export const revalidate = 1800; // 30 min cache

export async function GET() {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weather_code,is_day`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    const code = data.current?.weather_code ?? 0;
    const isDay = data.current?.is_day === 1;
    return NextResponse.json({
      condition: wmoToCondition(code),
      isDay,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json({ condition: "clouds", isDay: true });
  }
}
