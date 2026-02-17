"use client";

import { useState, useCallback } from "react";
import { Modal } from "./Modal";
import { chessPuzzle } from "../data/chess";

interface ChessModalProps {
  onClose: () => void;
}

export function ChessModal({ onClose }: ChessModalProps) {
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (
        chessPuzzle.solutionAliases.some(
          (alias) => alias.toLowerCase() === trimmed.toLowerCase()
        )
      ) {
        setSolved(true);
        setError(false);
      } else {
        setError(true);
        setTimeout(() => setError(false), 1500);
      }
    },
    [input]
  );

  return (
    <Modal title="CHESS PUZZLE" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-foreground">
          {chessPuzzle.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {chessPuzzle.description}
        </p>

        {/* Board placeholder */}
        <div className="mx-auto w-64 h-64 rounded border border-border bg-background grid grid-cols-8 grid-rows-8 overflow-hidden">
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isLight = (row + col) % 2 === 0;
            return (
              <div
                key={i}
                className={isLight ? "bg-surface-hover" : "bg-border"}
              />
            );
          })}
        </div>

        <p className="text-sm text-accent text-center">{chessPuzzle.prompt}</p>

        {solved ? (
          <div className="rounded border border-accent bg-accent/10 p-4 text-center">
            <p className="text-accent font-bold mb-2">Correct!</p>
            <p className="text-sm text-text-muted leading-relaxed">
              {chessPuzzle.explanation}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your move (e.g. Qb8+)"
              className={`flex-1 rounded border px-3 py-2 bg-background text-foreground text-sm font-mono
                         focus:outline-none focus:border-accent transition-colors
                         ${error ? "border-red-500" : "border-border"}`}
            />
            <button
              type="submit"
              className="rounded border border-accent px-4 py-2 text-accent text-sm tracking-wider
                         hover:bg-accent/10 transition-colors"
            >
              SUBMIT
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
