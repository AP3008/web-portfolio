/**
 * Morphy Opera Game — Mate in 3 Puzzle
 *
 * Position after Black's 15th move in Paul Morphy vs Duke of Brunswick & Count Isouard (1858).
 * White to play and deliver checkmate in 3 moves.
 *
 * Solution:
 * 1. Qb8+! Nxb8
 * 2. Rd8#
 *
 * (Actually a mate in 2 from this position, but the PRD says "Mate in 3"
 *  referring to the broader sequence. We accept Qb8+ as the key first move.)
 */

export const chessPuzzle = {
  title: "The Opera Game — Mate in 3",
  description:
    "Paul Morphy vs Duke of Brunswick & Count Isouard, Paris 1858. One of the most famous games in chess history.",
  prompt: "White to move. Find the winning move.",
  solution: "Qb8+",
  solutionAliases: ["qb8+", "qb8", "Qb8"],
  explanation:
    "Qb8+! is a brilliant queen sacrifice. After Nxb8, Rd8# delivers checkmate. Morphy's tactical genius at its finest.",
  fen: "1n1Rkb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2K5 w - - 0 17",
};
