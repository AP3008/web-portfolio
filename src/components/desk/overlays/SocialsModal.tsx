"use client";

import { Modal } from "./Modal";
import { socialLinks } from "../data/socials";

interface SocialsModalProps {
  onClose: () => void;
}

export function SocialsModal({ onClose }: SocialsModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border p-6 text-center hover:border-accent/60 hover:bg-accent/5 transition-colors"
          >
            <span className="text-lg font-bold text-foreground tracking-wider">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </Modal>
  );
}
