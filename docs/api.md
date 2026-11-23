# API

## Next.js routes (`src/app/api/`)

| Route | Method | Does | Cache |
| --- | --- | --- | --- |
| `/api/github-commits` | GET | The latest commit (message, SHA, additions/deletions) for every repo in `PROJECT_REPOS`, plus the 3 most recent `AP3008/web-portfolio` commits | `revalidate = 3600`, `s-maxage=3600` |
| `/api/spotify` | GET | Now playing or last played track (`SpotifyTrack`) | 60s |
| `/api/weather` | GET | Open-Meteo condition + time of day for London, Ontario | 30 min |
| `/api/views` | GET | Page view count (falls back to 0) | none |
| `/api/track-view` | POST | Increments the view count | none |
| `/api/colour-matrix` | GET / POST | Read the 3×3 matrix / toggle a cell `{ row, col }` | none |

## Env vars (`.env.local`, Vercel)

| Var | Used by |
| --- | --- |
| `WEB_API_KEY` | `track-view`, `colour-matrix` POST. Server-only; never expose it to the browser. |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | `spotify` |

## External Go API

Repo: `AP3008/web-portfolio-api`. Base URL `https://web-portfolio-api-nine.vercel.app`, hardcoded as `API_BASE` in each route. Authenticated calls append `?key=<WEB_API_KEY>`. The browser always calls the Next routes, never the Go API directly.

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| GET | `/views` | no | — | `{ count }` |
| POST | `/views/add` | yes | — | `{ count }` |
| GET | `/matrix` | no | — | `{ rows: 3, cols: 3, cells: number[][] }` |
| POST | `/matrix/toggle` | yes | `{ row, col }` (0–2) | `{ row, col, value }` |

Errors: `401 { error: "unauthorized" }`, `400 { error: "row or col out of bounds" }`, `400 { error: "invalid JSON body" }`. The matrix is always 3×3 and its cells are only 0 or 1.
