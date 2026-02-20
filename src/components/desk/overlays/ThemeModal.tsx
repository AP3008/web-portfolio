"use client";

import { Modal } from "./Modal";
import { ThemePicker } from "@/components/gate/ThemePicker";

interface ThemeModalProps {
  onClose: () => void;
}

export function ThemeModal({ onClose }: ThemeModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-7">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Theme Settings
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
