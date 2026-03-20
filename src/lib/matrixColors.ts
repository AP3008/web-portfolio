import { type ThemeVariant, type RosePinePalette, ROSE_PINE_PALETTES } from "./themes";

/** Palette keys for each tile position (0-8) in the 3x3 matrix */
export const MATRIX_COLOR_KEYS: (keyof RosePinePalette)[] = [
  "love",
  "gold",
  "rose",
  "pine",
  "foam",
  "iris",
  "subtle",
  "text",
  "highlightHigh",
];

/** Returns the 9 tile colors for a given theme variant */
export function getMatrixColors(variant: ThemeVariant): string[] {
  const palette = ROSE_PINE_PALETTES[variant];
  return MATRIX_COLOR_KEYS.map((key) => palette[key]);
}
