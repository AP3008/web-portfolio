"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS, type DeskObjectId } from "@/lib/constants";

interface TerminalLine {
  type: "input" | "output";
  text: string;
  hint?: string;
}

const PROMPT = "PS C:\\Users\\Adam>";

const HELP_TEXT = `Available commands:
  help        — Show this message
  ls          — List desk objects
  whoami      — Display bio summary
  clear       — Clear terminal
  cd [object] — Focus on an object
  exit        — Exit terminal`;

const WHOAMI_TEXT = `Adam Porbanderwalla
Software Engineer | 3.9 GPA
Building immersive web experiences with React, Three.js, and TypeScript.`;

const objectAliases: Record<string, DeskObjectId> = {
  monitor: "monitor",
  terminal: "monitor",
  keyboard: "keyboard",
  projects: "keyboard",
  notebook: "notebook",
  about: "notebook",
  papers: "papers",
  resume: "papers",
  shaker: "shaker",
  protein: "shaker",
  fitness: "shaker",
  "protein-powder": "protein_powder",
  powder: "protein_powder",
  bodybuilding: "shaker",
  chess: "chessboard",
  chessboard: "chessboard",
  phone: "phone",
  socials: "phone",
};

function renderLineText(text: string, hint?: string) {
  if (!hint) return text;
  const idx = text.indexOf(hint);
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const after = text.slice(idx + hint.length);
  return (
    <>
      {before}
      <span className="border border-foreground/25 px-1.5 py-0.5 rounded">
        {hint}
      </span>
      {after}
    </>
  );
}

export function TerminalOverlay() {
  const terminalFocused = usePortfolioStore((s) => s.terminalFocused);
  const activeModal = usePortfolioStore((s) => s.activeModal);
  const focusObject = usePortfolioStore((s) => s.focusObject);
  const openModal = usePortfolioStore((s) => s.openModal);
  const setTerminalFocused = usePortfolioStore((s) => s.setTerminalFocused);
  const returnToDesk = usePortfolioStore((s) => s.returnToDesk);

  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: 'Type "help" to get started.', hint: "help" },
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
  }, [lines, input]);

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
          .filter((o) => o.interactive !== false)
          .map((o) => `  ${o.label.toLowerCase()}`)
          .join("\n");
      } else if (command === "whoami") {
        output = WHOAMI_TEXT;
      } else if (command === "clear") {
        setLines([]);
        return;
      } else if (command === "cd") {
        const target = parts.slice(1).join("-");
        const objectId = objectAliases[target];
        if (objectId) {
          output = `Focusing on ${DESK_OBJECTS[objectId].label}...`;
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
        { type: "input", text: `${PROMPT} ${cmd}` },
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

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  if (!terminalFocused) return null;

  return (
    <div
      onClick={handleContainerClick}
      className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm p-6 flex flex-col font-mono text-sm cursor-text"
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
        <span className="text-text-muted text-xs tracking-wider">
          Windows PowerShell
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); returnToDesk(); }}
          className="text-text-muted hover:text-accent transition-colors text-xs"
        >
          [ESC]
        </button>
      </div>

      {/* Terminal output + inline prompt */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto text-foreground"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap leading-relaxed text-foreground"
          >
            {renderLineText(line.text, line.hint)}
          </div>
        ))}

        {/* Active prompt line with inline input */}
        <div className="whitespace-pre-wrap leading-relaxed flex items-center">
          <span className="text-foreground shrink-0">{PROMPT}&nbsp;</span>
          <span className="text-foreground">{input}</span>
          <span
            className="inline-block w-[8px] h-[1.1em] bg-foreground ml-[1px]"
            style={{ animation: "blink-cursor 1.06s step-end infinite" }}
          />
        </div>
      </div>

      {/* Hidden input for capturing keystrokes */}
      <form onSubmit={handleSubmit} className="absolute -left-[9999px]">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!!activeModal}
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
