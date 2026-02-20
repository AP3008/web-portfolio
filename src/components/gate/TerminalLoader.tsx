"use client";

import { useState, useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const PROMPT = "visitor@web ~ %";
const SSH_COMMAND = "ssh ap3008.dev/3d";
const CHAR_DELAY = 70;
const POST_COMMAND_DELAY = 500;
const CONNECTING_DELAY = 400;
const LOADING_DELAY = 800;

export function TerminalLoader() {
  const percent = usePortfolioStore((s) => s.assetsLoadedPercent);
  const scenePhase = usePortfolioStore((s) => s.scenePhase);
  const setTerminalAnimDone = usePortfolioStore((s) => s.setTerminalAnimDone);

  const [typedCount, setTypedCount] = useState(1);
  const [typingDone, setTypingDone] = useState(false);
  const [showConnecting, setShowConnecting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showDone, setShowDone] = useState(false);

  // Type out SSH command character by character, starting immediately
  useEffect(() => {
    if (typingDone) return;

    if (typedCount >= SSH_COMMAND.length) {
      const timer = setTimeout(() => setTypingDone(true), POST_COMMAND_DELAY);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTypedCount((c) => c + 1);
    }, CHAR_DELAY);
    return () => clearTimeout(timer);
  }, [typedCount, typingDone]);

  // After typing done, show "Connecting..." then "Loading..."
  useEffect(() => {
    if (!typingDone) return;

    const t1 = setTimeout(() => setShowConnecting(true), CONNECTING_DELAY);
    const t2 = setTimeout(() => setShowLoading(true), CONNECTING_DELAY + LOADING_DELAY);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [typingDone]);

  // Once loading text is visible and assets are at 100%, show done and signal animation complete
  useEffect(() => {
    if (!showLoading || percent < 100) return;

    setShowDone(true);
    setTerminalAnimDone(true);
  }, [showLoading, percent, setTerminalAnimDone]);

  if (scenePhase !== "loading") return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background p-6 font-mono text-sm">
      {/* Prompt line with typed command */}
      <div className="text-foreground whitespace-pre-wrap leading-relaxed">
        <span>{PROMPT}</span>
        {" "}
        <span>{SSH_COMMAND.slice(0, typedCount)}</span>
        {!typingDone && (
          <span
            className="inline-block w-2 h-[1.1em] bg-foreground ml-px align-middle"
            style={{ animation: "blink-cursor 1.06s step-end infinite" }}
          />
        )}
      </div>

      {showConnecting && (
        <div className="text-foreground leading-relaxed mt-1">
          Connecting to ap3008.dev...
        </div>
      )}

      {showLoading && (
        <div className="text-foreground leading-relaxed mt-1">
          Loading... {Math.round(percent)}%
        </div>
      )}

      {showDone && (
        <div className="text-foreground leading-relaxed mt-1">
          Connection established.
        </div>
      )}
    </div>
  );
}
