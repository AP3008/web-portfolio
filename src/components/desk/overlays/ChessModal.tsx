"use client";

import { useState, useCallback } from "react";
import { Modal } from "./Modal";
import { chessPuzzle } from "../data/chess";

interface ChessModalProps {
  onClose: () => void;
}

const PIECE_CHARS: Record<string, string> = {
  K: "\u2654", k: "\u265A",
  Q: "\u2655", q: "\u265B",
  R: "\u2656", r: "\u265C",
  B: "\u2657", b: "\u265D",
  N: "\u2658", n: "\u265E",
  P: "\u2659", p: "\u265F",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function parseFen(fen: string): (string | null)[][] {
  const rows = fen.split(" ")[0].split("/");
  return rows.map((row) => {
    const squares: (string | null)[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let i = 0; i < parseInt(ch); i++) squares.push(null);
      } else {
        squares.push(ch);
      }
    }
    return squares;
  });
}

function isWhite(piece: string | null): boolean {
  return piece !== null && piece === piece.toUpperCase();
}

function isPathClear(
  board: (string | null)[][],
  fromRow: number, fromCol: number,
  toRow: number, toCol: number
): boolean {
  const stepRow = Math.sign(toRow - fromRow);
  const stepCol = Math.sign(toCol - fromCol);
  let r = fromRow + stepRow;
  let c = fromCol + stepCol;
  while (r !== toRow || c !== toCol) {
    if (board[r][c]) return false;
    r += stepRow;
    c += stepCol;
  }
  return true;
}

function isLegalMove(
  board: (string | null)[][],
  fromRow: number, fromCol: number,
  toRow: number, toCol: number
): boolean {
  const piece = board[fromRow][fromCol];
  if (!piece || !isWhite(piece)) return false;
  const target = board[toRow][toCol];
  if (target && isWhite(target)) return false;

  const upper = piece.toUpperCase();
  const dRow = toRow - fromRow;
  const dCol = toCol - fromCol;

  if (upper === "Q" || upper === "R") {
    if (fromRow === toRow || fromCol === toCol) {
      return isPathClear(board, fromRow, fromCol, toRow, toCol);
    }
    if (upper === "Q" && Math.abs(dRow) === Math.abs(dCol)) {
      return isPathClear(board, fromRow, fromCol, toRow, toCol);
    }
    return false;
  }
  if (upper === "B") {
    if (Math.abs(dRow) !== Math.abs(dCol)) return false;
    return isPathClear(board, fromRow, fromCol, toRow, toCol);
  }
  if (upper === "N") {
    return (
      (Math.abs(dRow) === 2 && Math.abs(dCol) === 1) ||
      (Math.abs(dRow) === 1 && Math.abs(dCol) === 2)
    );
  }
  if (upper === "K") {
    return Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1;
  }
  if (upper === "P") {
    if (dCol === 0 && dRow === -1 && !target) return true;
    if (dCol === 0 && dRow === -2 && fromRow === 6 && !target && !board[fromRow - 1][fromCol]) return true;
    if (Math.abs(dCol) === 1 && dRow === -1 && target) return true;
    return false;
  }
  return false;
}

function applyMove(
  board: (string | null)[][],
  fromRow: number, fromCol: number,
  toRow: number, toCol: number
): (string | null)[][] {
  const next = board.map((row) => [...row]);
  next[toRow][toCol] = next[fromRow][fromCol];
  next[fromRow][fromCol] = null;
  return next;
}

function toAlgebraic(row: number, col: number): string {
  return FILES[col] + (8 - row);
}

function fromAlgebraic(sq: string): { row: number; col: number } {
  const col = FILES.indexOf(sq[0]);
  const row = 8 - parseInt(sq[1]);
  return { row, col };
}

export function ChessModal({ onClose }: ChessModalProps) {
  const [board, setBoard] = useState(() => parseFen(chessPuzzle.fen));
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongMove, setWrongMove] = useState(false);
  const [message, setMessage] = useState(chessPuzzle.prompt);
  const [waiting, setWaiting] = useState(false);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (solved || wrongMove || waiting) return;

      const piece = board[row][col];

      if (!selected) {
        if (piece && isWhite(piece)) {
          setSelected({ row, col });
        }
        return;
      }

      if (selected.row === row && selected.col === col) {
        setSelected(null);
        return;
      }

      if (piece && isWhite(piece)) {
        setSelected({ row, col });
        return;
      }

      if (!isLegalMove(board, selected.row, selected.col, row, col)) {
        setSelected(null);
        return;
      }

      const fromSq = toAlgebraic(selected.row, selected.col);
      const toSq = toAlgebraic(row, col);
      const expected = chessPuzzle.solution[moveIndex];

      if (fromSq === expected.from && toSq === expected.to) {
        const newBoard = applyMove(board, selected.row, selected.col, row, col);
        setBoard(newBoard);
        setSelected(null);

        if (moveIndex === 0) {
          // White played Qb8+!
          setMessage("Qb8+! Brilliant queen sacrifice! Black must take...");
          setWaiting(true);
          setTimeout(() => {
            // Auto-play Black's response: Nxb8
            const blackMove = chessPuzzle.solution[1];
            const from = fromAlgebraic(blackMove.from);
            const to = fromAlgebraic(blackMove.to);
            const afterBlack = applyMove(newBoard, from.row, from.col, to.row, to.col);
            setBoard(afterBlack);
            setMessage("Nxb8... Now deliver the final blow!");
            setMoveIndex(2);
            setWaiting(false);
          }, 1200);
          setMoveIndex(1);
        } else if (moveIndex === 2) {
          // White played Rd8# — checkmate!
          setMessage("");
          setSolved(true);
        }
      } else {
        setWrongMove(true);
        setMessage("Not quite — try again!");
        setSelected(null);
        setTimeout(() => {
          setWrongMove(false);
          setMessage(chessPuzzle.prompt);
        }, 1500);
      }
    },
    [board, selected, moveIndex, solved, wrongMove, waiting]
  );

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        {/* Board */}
        <div className="relative select-none">
          <div className="flex ml-6">
            {FILES.map((f) => (
              <div key={f} className="w-10 h-4 flex items-center justify-center text-[10px] text-text-muted">
                {f}
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="flex flex-col">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-6 h-10 flex items-center justify-center text-[10px] text-text-muted">
                  {8 - i}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-8 border border-border rounded overflow-hidden">
              {board.flatMap((row, r) =>
                row.map((piece, c) => {
                  const isLight = (r + c) % 2 === 0;
                  const isSelected = selected?.row === r && selected?.col === c;
                  const isTarget =
                    selected && !solved && !waiting &&
                    isLegalMove(board, selected.row, selected.col, r, c);

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleSquareClick(r, c)}
                      className={`w-10 h-10 flex items-center justify-center text-2xl relative transition-colors
                        ${isLight ? "bg-[#b7c0d8]" : "bg-[#6b7aa1]"}
                        ${isSelected ? "bg-accent/50!" : ""}
                        ${isTarget ? "after:absolute after:w-3 after:h-3 after:rounded-full after:bg-accent/40" : ""}
                        ${!solved && !waiting ? "hover:brightness-110 cursor-pointer" : ""}
                      `}
                    >
                      {piece && (
                        <span className={`leading-none drop-shadow-sm ${isWhite(piece) ? "text-white" : "text-gray-900"}`}>
                          {PIECE_CHARS[piece]}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <p className={`text-sm text-center font-bold ${wrongMove ? "text-red-400" : "text-accent"}`}>
          {message}
        </p>

        {solved && (
          <div className="rounded border border-accent bg-accent/10 p-4 text-center w-full">
            <p className="text-accent font-bold mb-2">Checkmate!</p>
            <p className="text-sm text-text-muted leading-relaxed">
              {chessPuzzle.explanation}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
