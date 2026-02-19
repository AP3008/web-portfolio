"use client";

import { useState, useCallback, useEffect } from "react";
import { chessPuzzle } from "../data/chess";

interface ChessModalProps {
  onClose: () => void;
}

// Use filled (solid) characters for both colors — styled via CSS
const PIECE_CHARS: Record<string, string> = {
  K: "\u265A", k: "\u265A",
  Q: "\u265B", q: "\u265B",
  R: "\u265C", r: "\u265C",
  B: "\u265D", b: "\u265D",
  N: "\u265E", n: "\u265E",
  P: "\u265F", p: "\u265F",
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
        <div className="flex flex-col items-center gap-4">
          {/* Board */}
          <div className="relative select-none">
            <div className="flex ml-8">
              {FILES.map((f) => (
                <div key={f} className="w-[min(8vw,8vh)] h-5 flex items-center justify-center text-xs text-text-muted">
                  {f}
                </div>
              ))}
            </div>

            <div className="flex">
              <div className="flex flex-col">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-8 h-[min(8vw,8vh)] flex items-center justify-center text-xs text-text-muted">
                    {8 - i}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-8 border-2 border-[#8B4513] rounded overflow-hidden shadow-xl">
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
                        className={`w-[min(8vw,8vh)] h-[min(8vw,8vh)] flex items-center justify-center text-[min(5vw,5vh)] relative transition-colors
                          ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"}
                          ${isSelected ? "bg-accent/50!" : ""}
                          ${isTarget ? "after:absolute after:w-4 after:h-4 after:rounded-full after:bg-accent/40" : ""}
                          ${!solved && !waiting ? "hover:brightness-110 cursor-pointer" : ""}
                        `}
                      >
                        {piece && (
                          <span
                            className="leading-none drop-shadow-md"
                            style={
                              isWhite(piece)
                                ? { color: "#fff", WebkitTextStroke: "1px #333", paintOrder: "stroke fill" }
                                : { color: "#1a1a1a" }
                            }
                          >
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

          {/* Message */}
          <p className={`text-sm text-center font-bold font-mono ${wrongMove ? "text-red-400" : "text-accent"}`}>
            {message}
          </p>

          {/* Checkmate banner */}
          {solved && (
            <div className="rounded border border-accent bg-accent/10 backdrop-blur-sm p-4 text-center max-w-lg">
              <p className="text-accent font-bold mb-2">Checkmate!</p>
              <p className="text-sm text-text-muted leading-relaxed">
                {chessPuzzle.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
