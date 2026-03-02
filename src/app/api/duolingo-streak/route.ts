import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(
      "https://duolingo-api-five.vercel.app/user/APE3MP",
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      return NextResponse.json({ streak: null }, { status: 502 });
    }

    const text = await res.text();
    const streak = parseInt(text, 10);

    return NextResponse.json(
      { streak: isNaN(streak) ? null : streak },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch {
    return NextResponse.json({ streak: null }, { status: 500 });
  }
}
