"use client";

import { Modal } from "./Modal";
import { resumeData } from "../data/resume";

interface ResumeModalProps {
  onClose: () => void;
}

export function ResumeModal({ onClose }: ResumeModalProps) {
  return (
    <Modal title="RESUME" onClose={onClose}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">
            {resumeData.name}
          </h3>
          <p className="text-sm text-text-muted">{resumeData.title}</p>
        </div>

        {/* PDF preview placeholder */}
        <div className="w-full rounded border border-border bg-background p-8 text-center">
          <p className="text-text-muted text-sm mb-4">Resume Preview</p>
          <div className="h-64 rounded border border-border/50 bg-surface flex items-center justify-center">
            <span className="text-text-muted text-xs">PDF preview area</span>
          </div>
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
