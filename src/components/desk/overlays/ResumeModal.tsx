"use client";

import { Modal } from "./Modal";
import { resumeData } from "../data/resume";

interface ResumeModalProps {
  onClose: () => void;
}

export function ResumeModal({ onClose }: ResumeModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        {/* Embedded PDF viewer */}
        <div className="w-full rounded border border-border bg-background overflow-hidden">
          <iframe
            src={resumeData.pdfUrl}
            title="Resume PDF"
            className="w-full h-[75vh] border-0"
          />
        </div>

        <a
          href={resumeData.pdfUrl}
          download
          className="rounded border border-accent px-6 py-2 text-accent text-sm tracking-wider
                     hover:bg-accent/10 transition-colors"
        >
          DOWNLOAD PDF
        </a>
      </div>
    </Modal>
  );
}
