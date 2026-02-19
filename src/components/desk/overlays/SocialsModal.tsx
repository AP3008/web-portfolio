"use client";

import { useCallback, useEffect } from "react";
import { socialLinks } from "../data/socials";

interface SocialsModalProps {
  onClose: () => void;
}

export function SocialsModal({ onClose }: SocialsModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <>
      {/* ESC button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-60 text-text-muted hover:text-accent transition-colors text-sm font-mono tracking-wider"
      >
        [ESC]
      </button>

      {/* No backdrop — 3D scene visible behind */}
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Phone container — image in flow gives size */}
        <div className="relative max-h-[95vh]">
          {/* Phone frame — in normal flow to define container size, pointer-events-none so clicks pass through */}
          <img
            src="/phone_png.png"
            alt=""
            className="h-full max-h-[95vh] w-auto object-contain relative pointer-events-none"
            style={{ zIndex: 2, mixBlendMode: "multiply" }}
            draggable={false}
          />

          {/* Screen content — behind the frame image but above the 3D scene */}
          <div
            className="absolute overflow-y-auto flex flex-col bg-[#1a1a1a] rounded-[8%]"
            style={{ top: "8%", left: "30%", right: "31%", bottom: "10%", zIndex: 1 }}
          >
            {/* Status bar */}
            <div className="px-5 pt-5 pb-2 flex items-center justify-between text-[10px] text-text-muted shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pb-4 flex flex-col">
              <h2 className="text-foreground text-base font-bold mb-0.5">Socials</h2>
              <p className="text-text-muted text-[10px] mb-4">@adam.porbanderwalla</p>

              <div className="flex flex-col gap-1.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-[#222] px-3 py-2.5 hover:bg-[#2a2a2a] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <svg
                        viewBox={link.viewBox ?? "0 0 24 24"}
                        className="w-4 h-4 fill-foreground group-hover:fill-accent transition-colors"
                      >
                        <path d={link.iconPath} />
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-foreground text-xs font-medium">
                        {link.label}
                      </span>
                      <span className="text-text-muted text-[10px] truncate">
                        {link.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 fill-none stroke-text-muted ml-auto shrink-0"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-1.5 pt-1 shrink-0">
              <div className="w-24 h-1 bg-[#555] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
