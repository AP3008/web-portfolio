"use client";

import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { Modal } from "./Modal";
import { ThemePicker } from "@/components/gate/ThemePicker";

interface ThemeModalProps {
  onClose: () => void;
}

export function ThemeModal({ onClose }: ThemeModalProps) {
  const textColor = useThemeStore((s) => s.textColor);
  const title = useTypingEffect("Theme Settings", 80);

  return (
    <Modal onClose={onClose}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-7">
        <div className="text-center">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: textColor }}
          >
            {title}
            <span
              className="ml-1 inline-block h-[1.1em] w-[2px] align-middle"
              style={{
                backgroundColor: textColor,
                animation: "blink-cursor 1.06s step-end infinite",
              }}
            />
          </h2>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ color: "var(--rp-muted)" }}
          >
            Change theme and text color site-wide.
          </p>
        </div>

        <ThemePicker mode="expanded" />
      </div>
    </Modal>
  );
}
