# Architecture

## Folder map

```
src/
  app/
    page.tsx              Landing page (Gatekeeper: choose 2D or 3D, theme picker)
    layout.tsx            Root layout, JetBrains Mono, Vercel Analytics
    globals.css           Tailwind v4 theme, blink-cursor keyframes
    3d/page.tsx           3D desk route (wrapped in DesktopGuard)
    2d/                   2D site: page.tsx, about/, projects/, socials/
    api/                  Server routes, see docs/api.md
  components/
    gate/                 Gatekeeper, DesktopGuard, TerminalLoader, ThemePicker
    three/                WebGL only: CanvasRoot, SceneRoot, DeskModel, RoomModel,
                          Interactables, objects/InteractableObject,
                          camera/CameraRig + CameraController, loading/useAssetProgress
    desk/
      DeskExperience.tsx  3D orchestrator (canvas + overlays)
      overlays/           DOM overlays: Modal, ModalManager, HoverHUD, TerminalOverlay,
                          ExitOverlay and one *Modal.tsx per modal type
      data/               Shared content: projects.tsx, about.ts, resume.ts, chess.ts, socials.ts
    2d/                   2D site sections (TwoDLayout, Navigator, ProjectsSection,
                          SpotifyBox, ColourMatrix, LocationMap, WeatherTime, ...)
    PersonalSocialLinks.tsx
  store/
    usePortfolioStore.ts  3D scene + interaction state
    useThemeStore.ts      Rosé Pine variant + text colour (persisted)
    useSpotifyStore.ts    Now-playing fetch state (fetches once)
    useBrowseTimerStore.ts  Total browse time (persisted)
  lib/
    constants.ts          DeskObjectId, ModalType, ScenePhase, DESK_OBJECTS, ROUTES,
                          DURATIONS, ASSETS, DESKTOP_MIN_WIDTH
    themes.ts             Palettes + text colour options
    matrixColors.ts       Palette keys for the 2D colour matrix tiles
    useTypingEffect.ts    Typing-title hook shared by Gatekeeper and modals
    device.ts             useIsDesktop()
    perf.ts               FPS measurement + quality auto-tuning
public/
  models/                 GLB models (see docs/3d-desk.md)
  chess_pieces/           Chess piece images
  Adam-Porbanderwalla-Resume.pdf
```

## 3D state (`usePortfolioStore`)

`ScenePhase`: `gate → loading → desk ⇄ focused`.

- `interactionsEnabled` is true only in the `desk` phase. `focusObject`, `openModal` and leaving the desk phase all turn it off.
- `closeModal()` and `returnToDesk()` both fully reset to the desk in one action: they unfocus, close the modal, clear the hover and drop terminal focus.
- `quality` (`high`/`medium`/`low`) is set by `perf.ts`. When FPS drops it disables shadows and lowers the DPR.

## Interaction rules

1. An object is hoverable or clickable only when `scenePhase === "desk"` and its `interactive !== false`.
2. While an object is focused or a modal is open, every other interaction is disabled, including terminal commands.
3. Hover applies an emissive green glow to the GLB meshes and shows `hudLabel` in `HoverHUD`, debounced by `DURATIONS.HOVER_DEBOUNCE_MS` (120ms). Objects linked by `linkedHoverId` glow together.
4. A click focuses the camera. The modal or terminal opens after `DURATIONS.CAMERA_FOCUS` (1.2s) so the zoom animation is visible first.
5. ESC key priority: `activeModal → closeModal()`, then `scenePhase === "focused" → returnToDesk()`, then `terminalFocused → setTerminalFocused(false)`.
6. Clicking the modal backdrop or the fixed ESC button (top-right, outside the panel) closes the modal and returns to the desk.
7. The terminal captures keystrokes only while `terminalFocused` is true. Its `[ESC]` button and the `exit` command call `returnToDesk()`.

## Camera

- **Desk view:** `DEFAULT_CAMERA_POSITION` / `DEFAULT_CAMERA_TARGET`. `CameraRig` moves the camera with the mouse ("mouse as eyes", lerp amplitude 0.4).
- **Focus:** `CameraController` uses GSAP to animate `camera.position` and `lookAt` to the object's `cameraPosition` / `cameraTarget`. Returning to the desk reverses this.
- The desk model is scaled 1.3×. The room (`empty_bedroom.glb`) is scaled 2× and rotated `-π/2` on Y to face the window, with a sky-blue background behind the window gaps.

## Modals

- `ModalManager` maps `activeModal` to a component.
- `Modal.tsx` is the shared panel: viewport-sized (`calc(100vw-6rem)` × `calc(100vh-6rem)`, max-width 1400px), `rounded-2xl`, `bg-black/50` blurred backdrop, Rosé Pine colours. It is used by About, Fitness, Projects and Theme.
- Chess, Socials and Resume float on a blurred backdrop without the `Modal` wrapper.
- Panel modals use `useTypingEffect` for an animated title with a blinking cursor.

## 3D objects

`InteractableObject` loads each GLB with `useGLTF`, clones the scene per instance, and nests position and rotation in separate `<group>`s so a model rotates in place. Every `modelUrl` is preloaded with `useGLTF.preload()`.
