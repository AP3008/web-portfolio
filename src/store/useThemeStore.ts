import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ROSE_PINE_PALETTES,
  DEFAULT_TEXT_COLOR,
  DAWN_DEFAULT_TEXT,
  type ThemeVariant,
  type RosePinePalette,
} from "@/lib/themes";

interface ThemeState {
  variant: ThemeVariant;
  textColor: string;
  setVariant: (variant: ThemeVariant) => void;
  setTextColor: (color: string) => void;
  palette: () => RosePinePalette;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      variant: "classic",
      textColor: DEFAULT_TEXT_COLOR,
      setVariant: (variant) => {
        const current = get().textColor;
        let textColor = current;

        if (variant === "dawn" && current === DEFAULT_TEXT_COLOR) {
          textColor = DAWN_DEFAULT_TEXT;
        } else if (variant !== "dawn" && current === DAWN_DEFAULT_TEXT) {
          textColor = DEFAULT_TEXT_COLOR;
        }

        set({ variant, textColor });
      },
      setTextColor: (textColor) => set({ textColor }),
      palette: () => ROSE_PINE_PALETTES[get().variant],
    }),
    {
      name: "rose-pine-theme",
    }
  )
);
