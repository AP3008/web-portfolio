"use client";

import { useMemo } from "react";
import { Modal } from "./Modal";
import { LivePulseCard } from "./LivePulseCard";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

interface FitnessModalProps {
  onClose: () => void;
}

export function FitnessModal({ onClose }: FitnessModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const textColor = useThemeStore((s) => s.textColor);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("Body Building", 80);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6 h-full">
        {/* Title with typing effect */}
        <h2
          className="text-3xl font-bold"
          style={{ color: textColor }}
        >
          {title}
          <span
            className="inline-block w-[2px] h-[1.1em] ml-1 align-middle"
            style={{
              backgroundColor: textColor,
              animation: "blink-cursor 1.06s step-end infinite",
            }}
          />
        </h2>

        <LivePulseCard palette={palette} textColor={textColor} />
      </div>
    </Modal>
  );
}
