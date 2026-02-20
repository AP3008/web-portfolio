"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { DESK_OBJECTS, type DeskObjectId } from "@/lib/constants";

interface TerminalLine {
  type: "input" | "output";
  text: string;
  hint?: string;
  link?: string;
}

const PROMPT = "PS C:\\Users\\Adam>";

const HELP_TEXT = `Available commands:
  help        — Show this message
  ls          — List desk objects
  whoami      — Display bio summary
  clear       — Clear terminal
  cd [object] — Focus on an object
  emacs       — Try it
  vim         — Try it
  nvim        — Show nvim config
  ghostty     — Apply Ghostty theme
  exit        — Exit terminal`;

const WHOAMI_TEXT = `Adam Porbanderwalla
Full-Stack Developer | Future 10,000x Engineer`;

const GHOSTTY_CONFIG = `# --- Ghostty Configuration 1.2.3 ---

# Theme & Appearance
theme = Rose Pine
background-opacity = 0.90
window-colorspace = display-p3
macos-titlebar-style = transparent
# Optional: makes the padding look uniform on all sides
window-padding-balance = true`;

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

function renderLineText(text: string, hint?: string, link?: string) {
  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-1 underline-offset-2 hover:decoration-2"
        style={{ color: "var(--rp-foam, #9ccfd8)" }}
      >
        {text}
      </a>
    );
  }
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
  const [ghosttyActive, setGhosttyActive] = useState(false);
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

      if (command === "help") {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: HELP_TEXT },
        ]);
      } else if (command === "ls") {
        const output = Object.values(DESK_OBJECTS)
          .filter((o) => o.interactive !== false)
          .map((o) => `  ${o.label.toLowerCase()}`)
          .join("\n");
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: output },
        ]);
      } else if (command === "whoami") {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: WHOAMI_TEXT },
        ]);
      } else if (command === "clear") {
        setLines([]);
        return;
      } else if (command === "cd") {
        const target = parts.slice(1).join("-");
        const objectId = objectAliases[target];
        if (objectId) {
          const output = `Focusing on ${DESK_OBJECTS[objectId].label}...`;
          setLines((prev) => [
            ...prev,
            { type: "input", text: `${PROMPT} ${cmd}` },
            { type: "output", text: output },
          ]);
          setTimeout(() => {
            setTerminalFocused(false);
            focusObject(objectId);
            const config = DESK_OBJECTS[objectId];
            if (config.modal) {
              openModal(config.modal);
            }
          }, 300);
        } else {
          setLines((prev) => [
            ...prev,
            { type: "input", text: `${PROMPT} ${cmd}` },
            { type: "output", text: `cd: no such object: ${parts[1] || "(none)"}` },
          ]);
        }
      } else if (command === "emacs") {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: "Who uses emacs... Try vim" },
        ]);
      } else if (command === "vim") {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: "I think you meant nvim" },
        ]);
      } else if (command === "nvim") {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: "A smart individual!\nCheckout my configs for nvim:" },
          { type: "output", text: "https://github.com/AP3008/dotfiles", link: "https://github.com/AP3008/dotfiles" },
        ]);
      } else if (command === "ghostty") {
        setGhosttyActive(true);
        setLines([
          { type: "output", text: "My Ghostty Theme Applied" },
        ]);
      } else if (command === "exit") {
        returnToDesk();
        return;
      } else if (command === "") {
        return;
      } else {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${PROMPT} ${cmd}` },
          { type: "output", text: `command not found: ${command}` },
        ]);
      }
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
      className="fixed inset-0 z-40 backdrop-blur-sm p-6 flex flex-col font-mono text-sm cursor-text"
      style={{
        backgroundColor: ghosttyActive ? "rgba(25, 23, 36, 0.90)" : "rgba(10, 10, 10, 0.95)",
        color: ghosttyActive ? "#9ccfd8" : undefined,
        ...(ghosttyActive ? { fontFamily: "'JetBrains Mono', monospace" } : {}),
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between pb-2 mb-2"
        style={{ borderBottom: `1px solid ${ghosttyActive ? "#403d52" : "var(--border)"}` }}
      >
        <span
          className="text-xs tracking-wider"
          style={{ color: ghosttyActive ? "#6e6a86" : "var(--text-muted)" }}
        >
          {ghosttyActive ? "Ghostty" : "Windows PowerShell"}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); returnToDesk(); }}
          className="text-xs transition-colors"
          style={{ color: ghosttyActive ? "#6e6a86" : "var(--text-muted)" }}
        >
          [ESC]
        </button>
      </div>

      {/* Terminal output + inline prompt */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ color: ghosttyActive ? "#9ccfd8" : "var(--foreground)" }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap leading-relaxed"
          >
            {renderLineText(line.text, line.hint, line.link)}
          </div>
        ))}

        {/* Active prompt line with inline input */}
        <div className="whitespace-pre-wrap leading-relaxed flex items-center">
          <span className="shrink-0">{PROMPT}&nbsp;</span>
          <span>{input}</span>
          <span
            className="inline-block w-[8px] h-[1.1em] ml-[1px]"
            style={{
              backgroundColor: ghosttyActive ? "#9ccfd8" : "var(--foreground)",
              animation: "blink-cursor 1.06s step-end infinite",
            }}
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
