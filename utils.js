module.exports = {
  createPgn: function (history) {
    let turn = 1;
    let half = true;
    let pgn = [];

    history.forEach((san) => {
      if (half) {
        pgn.push(`${turn}.`, san);
      } else {
        pgn.push(san);
        turn++;
      }
      half = !half;
    });

    return pgn.join(" ");
  },
};
