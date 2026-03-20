import { NextResponse } from "next/server";

export const revalidate = 60;

export interface SpotifyTrack {
  trackId: string;
  trackName: string;
  artistName: string;
  isPlaying: boolean;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify env vars");
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${errorBody}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Try currently playing first
    const cpRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers, next: { revalidate: 60 } }
    );

    if (cpRes.status === 200) {
      const cp = await cpRes.json();
      if (cp?.item) {
        const track: SpotifyTrack = {
          trackId: cp.item.id,
          trackName: cp.item.name,
          artistName: cp.item.artists
            .map((a: { name: string }) => a.name)
            .join(", "),
          isPlaying: cp.is_playing,
        };
        return NextResponse.json(track, {
          headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
        });
      }
    }

    // Fall back to recently played
    const rpRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers, next: { revalidate: 60 } }
    );

    if (!rpRes.ok) {
      const rpErr = await rpRes.text();
      throw new Error(`Failed to fetch recently played: ${rpRes.status} ${rpErr}`);
    }
    const rp = await rpRes.json();
    const item = rp.items?.[0]?.track;
    if (!item) throw new Error("No recent tracks");

    const track: SpotifyTrack = {
      trackId: item.id,
      trackName: item.name,
      artistName: item.artists.map((a: { name: string }) => a.name).join(", "),
      isPlaying: false,
    };

    return NextResponse.json(track, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Spotify API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
