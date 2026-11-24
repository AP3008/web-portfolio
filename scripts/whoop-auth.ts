// One-time Whoop authorization: prints the auth URL, takes the redirect URL back, and seeds the token Blob.
// Run with `npm run whoop:auth`. Node runs this file directly, so keep to erasable TS syntax.
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { put } from "@vercel/blob";
import { WHOOP } from "../src/lib/constants.ts";

const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
// Must match the redirect registered in the Whoop dashboard character for character.
const REDIRECT_URI = "https://www.ap3008.dev/";
const SCOPES = "offline read:recovery read:cycles read:sleep";

const clientId = process.env.WHOOP_CLIENT_ID;
const clientSecret = process.env.WHOOP_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  throw new Error("Missing WHOOP_CLIENT_ID / WHOOP_CLIENT_SECRET in .env.local");
}

// Whoop requires state to be exactly 8 characters.
const state = randomBytes(4).toString("hex");
const authUrl = `${AUTH_URL}?${new URLSearchParams({
  response_type: "code",
  client_id: clientId,
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
  state,
})}`;

console.log(`\nOpen this URL and approve access:\n\n${authUrl}\n`);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const landed = new URL((await rl.question("Paste the full URL you landed on: ")).trim());
rl.close();

if (landed.searchParams.get("state") !== state) {
  throw new Error("state mismatch; start again");
}
const code = landed.searchParams.get("code");
if (!code) {
  throw new Error(`No code in the pasted URL (error: ${landed.searchParams.get("error") ?? "none"})`);
}

const res = await fetch(WHOOP.TOKEN_URL, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
  }),
});
if (!res.ok) {
  throw new Error(`Whoop code exchange failed: ${res.status} ${await res.text()}`);
}
const data = await res.json();
if (!data.refresh_token) {
  throw new Error("Whoop returned no refresh token; is the offline scope granted?");
}

// Re-auth only runs when the chain is dead, so overwrite unconditionally (no etag).
await put(
  WHOOP.TOKEN_BLOB_PATH,
  JSON.stringify({
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
    refresh_token: data.refresh_token,
  }),
  { access: "private", allowOverwrite: true, contentType: "application/json" },
);

console.log(`Whoop token saved to Blob at ${WHOOP.TOKEN_BLOB_PATH}.`);
