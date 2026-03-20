import { NextResponse } from "next/server";

export const revalidate = 0;

const DEFAULT_MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export async function GET() {
  const apiUrl = process.env.MATRIX_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ matrix: DEFAULT_MATRIX });
  }

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ matrix: data.matrix ?? DEFAULT_MATRIX });
  } catch (err) {
    console.error("Colour matrix GET error:", err);
    return NextResponse.json({ matrix: DEFAULT_MATRIX });
  }
}

export async function POST(request: Request) {
  const apiUrl = process.env.MATRIX_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: "MATRIX_API_URL not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrix: body.matrix }),
    });

    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ matrix: data.matrix });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Colour matrix POST error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
