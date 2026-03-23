import { NextResponse } from "next/server";

export const revalidate = 0;

const API_BASE = "https://web-portfolio-api-nine.vercel.app";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/views`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ count: data.count ?? 0 });
  } catch (err) {
    console.error("Views GET error:", err);
    return NextResponse.json({ count: 0 });
  }
}
