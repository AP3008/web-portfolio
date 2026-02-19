"use client";

import { useMemo } from "react";
import { Modal } from "./Modal";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { useThemeStore } from "@/store/useThemeStore";
import { ROSE_PINE_PALETTES } from "@/lib/themes";

interface FitnessModalProps {
  onClose: () => void;
}

interface Exercise {
  name: string;
  sets: string;
}

interface WorkoutDay {
  title: string;
  schedule: string;
  exercises: Exercise[];
}

const ROUTINE: WorkoutDay[] = [
  {
    title: "Push",
    schedule: "Mon / Thu",
    exercises: [
      { name: "Bench Press", sets: "4 x 8-10" },
      { name: "Overhead Press", sets: "3 x 8-10" },
      { name: "Incline DB Press", sets: "3 x 10-12" },
      { name: "Lateral Raises", sets: "3 x 12-15" },
      { name: "Tricep Pushdowns", sets: "3 x 10-12" },
    ],
  },
  {
    title: "Pull",
    schedule: "Tue / Fri",
    exercises: [
      { name: "Deadlift", sets: "3 x 5" },
      { name: "Barbell Rows", sets: "4 x 8-10" },
      { name: "Pull-ups", sets: "3 x 8-12" },
      { name: "Face Pulls", sets: "3 x 12-15" },
      { name: "Barbell Curls", sets: "3 x 10-12" },
    ],
  },
  {
    title: "Legs",
    schedule: "Wed / Sat",
    exercises: [
      { name: "Squats", sets: "4 x 6-8" },
      { name: "Romanian Deadlift", sets: "3 x 8-10" },
      { name: "Leg Press", sets: "3 x 10-12" },
      { name: "Leg Curls", sets: "3 x 10-12" },
      { name: "Calf Raises", sets: "4 x 12-15" },
    ],
  },
];

export function FitnessModal({ onClose }: FitnessModalProps) {
  const variant = useThemeStore((s) => s.variant);
  const palette = useMemo(() => ROSE_PINE_PALETTES[variant], [variant]);
  const title = useTypingEffect("Body Building", 80);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Title with typing effect */}
        <h2
          className="text-2xl font-bold"
          style={{ color: palette.text }}
        >
          {title}
          <span
            className="inline-block w-[2px] h-[1.1em] ml-1 align-middle"
            style={{
              backgroundColor: palette.text,
              animation: "blink-cursor 1.06s step-end infinite",
            }}
          />
        </h2>

        {/* Hevy banner */}
        <a
          href="https://hevy.com/user/adamp3008"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl px-4 py-3 text-sm transition-opacity hover:opacity-80 inline-flex items-center gap-2"
          style={{
            backgroundColor: palette.overlay,
            color: palette.iris,
          }}
        >
          Check me out on Hevy
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-none shrink-0"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>

        {/* Subtitle */}
        <p className="text-sm" style={{ color: palette.muted }}>
          Push / Pull / Legs — 6 days on, 1 rest
        </p>

        {/* Workout days */}
        <div className="flex flex-col gap-4">
          {ROUTINE.map((day) => (
            <div
              key={day.title}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.highlightMed,
              }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <h3
                  className="font-bold text-base"
                  style={{ color: palette.iris }}
                >
                  {day.title}
                </h3>
                <span className="text-xs" style={{ color: palette.muted }}>
                  {day.schedule}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {day.exercises.map((ex) => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm" style={{ color: palette.text }}>
                      {ex.name}
                    </span>
                    <span className="text-sm" style={{ color: palette.subtle }}>
                      {ex.sets}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
