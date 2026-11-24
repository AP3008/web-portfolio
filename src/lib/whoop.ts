// Server-only: reads secrets from env. Import it only from route handlers / server code.
import { get, put } from "@vercel/blob";
import { WHOOP } from "@/lib/constants";

interface WhoopToken {
  access_token: string;
  /** Epoch ms */
  expires_at: number;
  refresh_token: string;
}

/** Treat the access token as expired this long before Whoop does. */
const EXPIRY_MARGIN_MS = 60_000;

async function readToken(): Promise<{ token: WhoopToken; etag: string }> {
  const res = await get(WHOOP.TOKEN_BLOB_PATH, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) {
    throw new Error("Whoop token blob is missing; run `npm run whoop:auth`");
  }
  const text = await new Response(res.stream).text();
  let token: WhoopToken;
  try {
    token = JSON.parse(text);
  } catch {
    throw new Error("Whoop token blob is empty or invalid; run `npm run whoop:auth`");
  }
  if (!token?.access_token || !token.refresh_token || !token.expires_at) {
    throw new Error("Whoop token blob is empty or invalid; run `npm run whoop:auth`");
  }
  return { token, etag: res.blob.etag };
}

const isFresh = (token: WhoopToken) => token.expires_at - EXPIRY_MARGIN_MS > Date.now();

export async function getWhoopAccessToken(): Promise<string> {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing Whoop env vars");
  }

  const { token, etag } = await readToken();
  if (isFresh(token)) return token.access_token;

  try {
    const res = await fetch(WHOOP.TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
        scope: "offline",
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Whoop token refresh failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    const fresh: WhoopToken = {
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
      refresh_token: data.refresh_token,
    };
    // ifMatch: never overwrite a token another invocation wrote after our read.
    await put(WHOOP.TOKEN_BLOB_PATH, JSON.stringify(fresh), {
      access: "private",
      ifMatch: etag,
      contentType: "application/json",
    });
    return fresh.access_token;
  } catch (err) {
    // Lost a race (refresh rejected or etag conflict): another invocation rotated the token, so use theirs.
    const { token: stored } = await readToken();
    if (isFresh(stored)) return stored.access_token;
    throw err;
  }
}
