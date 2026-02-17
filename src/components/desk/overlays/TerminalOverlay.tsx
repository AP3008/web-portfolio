"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS, type DeskObjectId } from "@/lib/constants";

interface TerminalLine {
  type: "input" | "output";
  text: string;
}

const HELP_TEXT = `Available commands:
  help        — Show this message
  ls          — List desk objects
  whoami      — Display bio summary
  clear       — Clear terminal
  git log     — Show commit history
  cd [object] — Focus on an object
  exit        — Exit terminal`;

const WHOAMI_TEXT = `Adam Porbanderwalla
Software Engineer | 3.9 GPA
Building immersive web experiences with React, Three.js, and TypeScript.`;

const GIT_LOG_TEXT = `commit a1b2c3d (HEAD -> main)
Author: Adam <adam@dev.com>
Date:   2024-12-01

    feat: add 3D portfolio desk experience

commit e4f5g6h
Author: Adam <adam@dev.com>
Date:   2024-11-28

    refactor: clean up camera controller

commit i7j8k9l
Author: Adam <adam@dev.com>
Date:   2024-11-25

    init: project scaffold with Next.js + R3F`;

const objectAliases: Record<string, DeskObjectId> = {
  monitor: "monitor",
  terminal: "monitor",
  keyboard: "keyboard",
  projects: "keyboard",
  notebook: "notebook",
  about: "notebook",
  papers: "papers",
  resume: "papers",
  dumbbell: "dumbbell",
  fitness: "dumbbell",
  chess: "chess-knight",
  knight: "chess-knight",
  "chess-knight": "chess-knight",
  phone: "phone",
  socials: "phone",
};

export function TerminalOverlay() {
  const terminalFocused = usePortfolioStore((s) => s.terminalFocused);
  const activeModal = usePortfolioStore((s) => s.activeModal);
  const focusObject = usePortfolioStore((s) => s.focusObject);
  const openModal = usePortfolioStore((s) => s.openModal);
  const setTerminalFocused = usePortfolioStore((s) => s.setTerminalFocused);
  const returnToDesk = usePortfolioStore((s) => s.returnToDesk);

  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: 'Welcome to Adam\'s terminal. Type "help" for commands.' },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when terminal becomes focused
  useEffect(() => {
    if (terminalFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [terminalFocused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      const parts = trimmed.split(/\s+/);
      const command = parts[0];

      let output = "";

      if (command === "help") {
        output = HELP_TEXT;
      } else if (command === "ls") {
        output = Object.values(DESK_OBJECTS)
          .map((o) => `  ${o.label.toLowerCase()}`)
          .join("\n");
      } else if (command === "whoami") {
        output = WHOAMI_TEXT;
      } else if (command === "clear") {
        setLines([]);
        return;
      } else if (trimmed === "git log") {
        output = GIT_LOG_TEXT;
      } else if (command === "cd") {
        const target = parts.slice(1).join("-");
        const objectId = objectAliases[target];
        if (objectId) {
          output = `Focusing on ${DESK_OBJECTS[objectId].label}...`;
          // Navigate after a brief delay
          setTimeout(() => {
            setTerminalFocused(false);
            focusObject(objectId);
            const config = DESK_OBJECTS[objectId];
            if (config.modal) {
              openModal(config.modal);
            }
          }, 300);
        } else {
          output = `cd: no such object: ${parts[1] || "(none)"}`;
        }
      } else if (command === "exit") {
        returnToDesk();
        return;
      } else if (command === "") {
        return;
      } else {
        output = `command not found: ${command}`;
      }

      setLines((prev) => [
        ...prev,
        { type: "input", text: `$ ${cmd}` },
        { type: "output", text: output },
      ]);
    },
    [focusObject, openModal, returnToDesk, setTerminalFocused]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (activeModal) return;
      executeCommand(input);
      setInput("");
    },
    [input, activeModal, executeCommand]
  );

  // Don't render if terminal not focused or not in focused/desk phase on monitor
  if (!terminalFocused) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-2xl h-[60vh] rounded border border-accent/30 bg-background/95 backdrop-blur-sm p-4 flex flex-col font-mono text-sm pointer-events-auto">
        {/* Terminal header */}
        <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
          <span className="text-accent text-xs tracking-wider">
            adam@portfolio:~$
          </span>
          <button
            onClick={() => returnToDesk()}
            className="text-text-muted hover:text-accent transition-colors text-xs"
          >
            [ESC]
          </button>
        </div>

        {/* Terminal output */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-2 text-foreground"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap leading-relaxed ${
                line.type === "input" ? "text-accent" : "text-text-muted"
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-accent">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!!activeModal}
            className="flex-1 bg-transparent text-foreground outline-none caret-accent"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="w-2 h-4 bg-accent animate-pulse" />
        </form>
      </div>
    </div>
  );
}
