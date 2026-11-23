# Rosé Pine theme

The landing page, the 3D modals and the 2D site share one theme.

- **Palettes:** `src/lib/themes.ts` exports `ROSE_PINE_PALETTES` for the `classic`, `moon` and `dawn` variants. The keys are `base, surface, overlay, muted, subtle, text, love, gold, rose, pine, foam, iris, highlightLow/Med/High`. The colour values live only in that file; don't copy them elsewhere.
- **Text colour:** six options in `TEXT_COLOR_OPTIONS`. Dawn uses `TEXT_COLOR_OPTIONS_DAWN`, where `#575279` replaces `#e0def4`. Switching to or from Dawn swaps the default text colour automatically.
- **Store:** `useThemeStore` holds `variant`, `textColor`, `setVariant`, `setTextColor` and `palette()`. It is persisted to localStorage under `"rose-pine-theme"`.
- **Applying it:** DOM pages (`Gatekeeper`, `TwoDLayout`) set `--rp-*` CSS variables on a `.rose-pine` wrapper, so children use `var(--rp-*)`. The 3D modals read `palette()` and set inline styles. The selected text colour overrides `--rp-text`.
- **Font:** JetBrains Mono, loaded with `next/font/google` (`--font-jetbrains-mono`) plus a Google Fonts `<link>` fallback in `layout.tsx`.
- The 2D colour matrix maps its 9 tiles to palette keys with `getMatrixColors(variant)` (`src/lib/matrixColors.ts`).
