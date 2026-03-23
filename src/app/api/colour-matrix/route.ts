import { NextResponse } from "next/server";

export const revalidate = 0;

const API_BASE = "https://web-portfolio-api-nine.vercel.app";

const DEFAULT_MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/matrix`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ matrix: data.cells ?? DEFAULT_MATRIX });
  } catch (err) {
    console.error("Colour matrix GET error:", err);
    return NextResponse.json({ matrix: DEFAULT_MATRIX });
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.WEB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "WEB_API_KEY not configured" }, { status: 503 });
  }

  try {
    const { row, col } = await request.json();
    const res = await fetch(`${API_BASE}/matrix/toggle?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row, col }),
    });

    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Colour matrix POST error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
