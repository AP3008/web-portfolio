import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ROSE_PINE_PALETTES,
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
      textColor: "#e0def4",
      setVariant: (variant) => set({ variant }),
      setTextColor: (textColor) => set({ textColor }),
      palette: () => ROSE_PINE_PALETTES[get().variant],
    }),
    {
      name: "rose-pine-theme",
    }
  )
);
