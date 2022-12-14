module.exports = {
  STATE: {
    EMPTY: "empty",
    WAITING: "waiting",
    PENDING: "pending",
    READY: "ready",
    PLAYING: "playing",
    ENDED: "ended",
  },

  STATUS: {
    NORMAL: "normal",
    CHECK: "check",
    END: "end",
  },

  defaultTurn: "w",

  defaultFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

  defaultBoard: [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ],

  defaultMoves: [
    {
      from: { rank: 6, file: 0 },
      to: { rank: 4, file: 0 },
      piece: "P",
      faction: "w",
      san: "a4",
      lan: "a2a4",
      uci: "a2a4",
      fenResult: "rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1",
    },
    {
      from: { rank: 6, file: 0 },
      to: { rank: 5, file: 0 },
      piece: "P",
      faction: "w",
      san: "a3",
      lan: "a2a3",
      uci: "a2a3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 1 },
      to: { rank: 4, file: 1 },
      piece: "P",
      faction: "w",
      san: "b4",
      lan: "b2b4",
      uci: "b2b4",
      fenResult: "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1",
    },
    {
      from: { rank: 6, file: 1 },
      to: { rank: 5, file: 1 },
      piece: "P",
      faction: "w",
      san: "b3",
      lan: "b2b3",
      uci: "b2b3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 2 },
      to: { rank: 4, file: 2 },
      piece: "P",
      faction: "w",
      san: "c4",
      lan: "c2c4",
      uci: "c2c4",
      fenResult: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
    },
    {
      from: { rank: 6, file: 2 },
      to: { rank: 5, file: 2 },
      piece: "P",
      faction: "w",
      san: "c3",
      lan: "c2c3",
      uci: "c2c3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/2P5/PP1PPPPP/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 3 },
      to: { rank: 4, file: 3 },
      piece: "P",
      faction: "w",
      san: "d4",
      lan: "d2d4",
      uci: "d2d4",
      fenResult: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
    },
    {
      from: { rank: 6, file: 3 },
      to: { rank: 5, file: 3 },
      piece: "P",
      faction: "w",
      san: "d3",
      lan: "d2d3",
      uci: "d2d3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/3P4/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 4 },
      to: { rank: 4, file: 4 },
      piece: "P",
      faction: "w",
      san: "e4",
      lan: "e2e4",
      uci: "e2e4",
      fenResult: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    },
    {
      from: { rank: 6, file: 4 },
      to: { rank: 5, file: 4 },
      piece: "P",
      faction: "w",
      san: "e3",
      lan: "e2e3",
      uci: "e2e3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 5 },
      to: { rank: 4, file: 5 },
      piece: "P",
      faction: "w",
      san: "f4",
      lan: "f2f4",
      uci: "f2f4",
      fenResult: "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1",
    },
    {
      from: { rank: 6, file: 5 },
      to: { rank: 5, file: 5 },
      piece: "P",
      faction: "w",
      san: "f3",
      lan: "f2f3",
      uci: "f2f3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 6 },
      to: { rank: 4, file: 6 },
      piece: "P",
      faction: "w",
      san: "g4",
      lan: "g2g4",
      uci: "g2g4",
      fenResult: "rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNR b KQkq g3 0 1",
    },
    {
      from: { rank: 6, file: 6 },
      to: { rank: 5, file: 6 },
      piece: "P",
      faction: "w",
      san: "g3",
      lan: "g2g3",
      uci: "g2g3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 6, file: 7 },
      to: { rank: 4, file: 7 },
      piece: "P",
      faction: "w",
      san: "h4",
      lan: "h2h4",
      uci: "h2h4",
      fenResult: "rnbqkbnr/pppppppp/8/8/7P/8/PPPPPPP1/RNBQKBNR b KQkq h3 0 1",
    },
    {
      from: { rank: 6, file: 7 },
      to: { rank: 5, file: 7 },
      piece: "P",
      faction: "w",
      san: "h3",
      lan: "h2h3",
      uci: "h2h3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1",
    },
    {
      from: { rank: 7, file: 1 },
      to: { rank: 5, file: 2 },
      piece: "N",
      faction: "w",
      san: "Nc3",
      lan: "Nb1c3",
      uci: "b1c3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1",
    },
    {
      from: { rank: 7, file: 1 },
      to: { rank: 5, file: 0 },
      piece: "N",
      faction: "w",
      san: "Na3",
      lan: "Nb1a3",
      uci: "b1a3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq - 1 1",
    },
    {
      from: { rank: 7, file: 6 },
      to: { rank: 5, file: 7 },
      piece: "N",
      faction: "w",
      san: "Nh3",
      lan: "Ng1h3",
      uci: "g1h3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/7N/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
    },
    {
      from: { rank: 7, file: 6 },
      to: { rank: 5, file: 5 },
      piece: "N",
      faction: "w",
      san: "Nf3",
      lan: "Ng1f3",
      uci: "g1f3",
      fenResult: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
    },
  ],
};
