"use client";

import { Modal } from "./Modal";

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
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-foreground font-bold text-lg mb-1">
            Current Split
          </h2>
          <p className="text-text-muted text-sm">Push / Pull / Legs — 6 days on, 1 rest</p>
        </div>

        <div className="flex flex-col gap-4">
          {ROUTINE.map((day) => (
            <div
              key={day.title}
              className="rounded border border-border p-4"
            >
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-accent font-bold text-base">
                  {day.title}
                </h3>
                <span className="text-text-muted text-xs">{day.schedule}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {day.exercises.map((ex) => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-foreground text-sm">{ex.name}</span>
                    <span className="text-text-muted text-sm font-mono">
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
