# web-portfolio

Adam Porbanderwalla's portfolio at [ap3008.dev](https://ap3008.dev). The landing page (`/`) lets the visitor choose between two experiences:

- **3D** (`/3d`): a "Developer's Desk" scene in React Three Fiber. Clicking desk objects opens modals; the monitor opens a terminal. Desktop only (viewport ≥ 900px, enforced by `DesktopGuard`).
- **2D** (`/2d`, `/2d/about`, `/2d/projects`, `/2d/socials`): a conventional responsive site.

Both share one Rosé Pine theme store and one set of content data.

## Stack

Next.js 16 (App Router, TypeScript strict) · React 19 · `@react-three/fiber` 9 + `drei` 10 · Zustand 5 · GSAP 3 · Tailwind CSS v4 (`@theme inline`) · react-leaflet · Vercel Analytics.

## Commands

```bash
npm run dev     # local dev server
npm run build   # production build (also type-checks)
npm run lint    # eslint
```

There is no test suite.

## Working with the user

- Be concise when talking to the user. Sacrifice grammar for the sake of concision.
- Commit directly with the git CLI as the user, not as Claude: use the configured git identity, and add no `Co-Authored-By: Claude` trailer or "Generated with Claude" line.
- Do feature work on a separate branch (e.g. `feat/<name>`), never directly on `main`.

## Coding rules

- Keep components small and focused. WebGL code lives in `src/components/three/`; DOM overlays live in `src/components/desk/overlays/`.
- The Zustand store never calls GSAP. `CameraController` reacts to store changes and runs the animations.
- `src/lib/constants.ts` is the single source of truth for object IDs, labels, camera targets, routes, durations and asset paths.
- Clean up event listeners, GSAP timelines and R3F resources on unmount.
- Don't leave placeholder TODOs. Put unfinished features behind a flag.
- Write the minimum code the current requirement needs.
- Style UI with the Rosé Pine palette from `useThemeStore` (`palette.*`), not hardcoded colours.

## Docs

| Read this | When you are working on |
| --- | --- |
| `docs/architecture.md` | folder layout, stores, scene phases, camera/modal/interaction rules |
| `docs/3d-desk.md` | desk objects, terminal commands, individual modals |
| `docs/theme.md` | Rosé Pine variants, text colours, applying the theme |
| `docs/api.md` | `src/app/api/*` routes, the external Go API, env vars |
| `docs/adding-a-project.md` | adding a project card (2D + 3D) |

## Agent skills

### Issue tracker

Issues live in Linear: workspace "Adam Porbanderwalla", team `ADA`, project `Webportfolio`, accessed through the Linear MCP. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
