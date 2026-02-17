"use client";

import { Modal } from "./Modal";

interface FitnessModalProps {
  onClose: () => void;
}

export function FitnessModal({ onClose }: FitnessModalProps) {
  return (
    <Modal title="FITNESS" onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Image placeholder */}
        <div className="w-full h-48 rounded border border-border bg-background flex items-center justify-center">
          <span className="text-text-muted text-xs font-mono">
            [ Image: Jay Cutler Quad Stomp ]
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">
            Discipline Transfers
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Bodybuilding taught me that consistency beats intensity. The same
            principles that build a physique — progressive overload, tracking
            metrics, recovering smart, and showing up when motivation fades —
            are exactly what make a great engineer.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            Both require patience with the process, obsession with form, and
            the willingness to push through plateaus. The iron doesn&apos;t lie,
            and neither does the compiler.
          </p>
        </div>
      </div>
    </Modal>
  );
}
