import { NextResponse } from "next/server";

export const revalidate = 0;

const API_BASE = "https://web-portfolio-api-nine.vercel.app";

export async function POST() {
  const apiKey = process.env.WEB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "WEB_API_KEY not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${API_BASE}/views/add?key=${apiKey}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ count: data.count });
  } catch (err) {
    console.error("Track view POST error:", err);
    return NextResponse.json({ error: "Failed to track view" }, { status: 502 });
  }
}
