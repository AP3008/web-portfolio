/**
 * Morphy Opera Game — Mate in 2 Puzzle
 *
 * Position after Black's 15th move (15...Nxd7) in
 * Paul Morphy vs Duke of Brunswick & Count Isouard, Paris 1858.
 *
 * White: Kc1, Rd1, Qb3, Bg5, pawns a2,b2,c2,e4,f2,g2,h2
 * Black: Ke8, Rh8, Bf8, Nd7, Qe6, pawns a7,e5,f7,g7,h7
 *
 * Solution:
 * 1. Qb8+! Nxb8
 * 2. Rd8#
 */

export const chessPuzzle = {
  title: "The Opera Game",
  description:
    "Paul Morphy vs Duke of Brunswick & Count Isouard, Paris 1858.",
  prompt: "White to move. Find the winning combination!",
  explanation:
    "Qb8+! is a brilliant queen sacrifice. After Nxb8, Rd8# delivers checkmate. Morphy's tactical genius at its finest.",
  /** FEN for the position BEFORE 16. Qb8+ */
  fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w - - 0 16",
  /** Solution move sequence: [white, black-auto, white] */
  solution: [
    { from: "b3", to: "b8" }, // Qb8+!
    { from: "d7", to: "b8" }, // Nxb8 (auto-played)
    { from: "d1", to: "d8" }, // Rd8#
  ],
};
