# API

## Next.js routes (`src/app/api/`)

| Route | Method | Does | Cache |
| --- | --- | --- | --- |
| `/api/github-commits` | GET | The latest commit (message, SHA, additions/deletions) for every repo in `PROJECT_REPOS`, plus the 3 most recent `AP3008/web-portfolio` commits | `revalidate = 3600`, `s-maxage=3600` |
| `/api/spotify` | GET | Now playing or last played track (`SpotifyTrack`) | 60s |
| `/api/whoop` | GET | `LivePulse` (`src/lib/whoop.ts`): `{ date, recovery, strain \| null, sleepPerformance \| null }` for the Whoop day of the latest scored recovery. Only these public metrics leave the server. Any failure → `500 { error }` | `revalidate = 3600`, `s-maxage=3600, stale-while-revalidate=3600` |
| `/api/weather` | GET | Open-Meteo condition + time of day for London, Ontario | 30 min |
| `/api/views` | GET | Page view count (falls back to 0) | none |
| `/api/track-view` | POST | Increments the view count | none |
| `/api/colour-matrix` | GET / POST | Read the 3×3 matrix / toggle a cell `{ row, col }` | none |

## Env vars (`.env.local`, Vercel)

| Var | Used by |
| --- | --- |
| `WEB_API_KEY` | `track-view`, `colour-matrix` POST. Server-only; never expose it to the browser. |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | `spotify` |
| `WHOOP_CLIENT_ID`, `WHOOP_CLIENT_SECRET` | `whoop`, `scripts/whoop-auth.ts` |
| `VERCEL_OIDC_TOKEN` (from `vercel env pull`) | Private Blob store access (Whoop token) |

## Whoop token

Whoop refresh tokens rotate (each refresh kills the old one), so the token can't live in an env var. `src/lib/whoop.ts` keeps `{ access_token, expires_at, refresh_token }` in the private Vercel Blob `whoop/token.json` (`WHOOP.TOKEN_BLOB_PATH`). It reuses the access token until it expires, then refreshes and writes back with `ifMatch: etag`; losing a race re-reads the stored token. One token chain serves dev and prod.

The Whoop route caches whatever it returns, so a failure is served as a 500 for up to the full hour.

**Re-auth** (the chain is dead: `/api/whoop` 500s with a token error and the Live Pulse card is hidden): run `npm run whoop:auth`, open the printed URL, approve, and paste back the `https://www.ap3008.dev/?code=…` URL you land on. The script overwrites the Blob token.

## External Go API

Repo: `AP3008/web-portfolio-api`. Base URL `https://web-portfolio-api-nine.vercel.app`, hardcoded as `API_BASE` in each route. Authenticated calls append `?key=<WEB_API_KEY>`. The browser always calls the Next routes, never the Go API directly.

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| GET | `/views` | no | — | `{ count }` |
| POST | `/views/add` | yes | — | `{ count }` |
| GET | `/matrix` | no | — | `{ rows: 3, cols: 3, cells: number[][] }` |
| POST | `/matrix/toggle` | yes | `{ row, col }` (0–2) | `{ row, col, value }` |

Errors: `401 { error: "unauthorized" }`, `400 { error: "row or col out of bounds" }`, `400 { error: "invalid JSON body" }`. The matrix is always 3×3 and its cells are only 0 or 1.
