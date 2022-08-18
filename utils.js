const { customAlphabet } = require("nanoid");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

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

  handleError: function (error, res) {
    if (typeof error === "string") {
      let [code, message] = error.split("/");
      code = Number(code);
      res.status(code).json(message);
    } else {
      res.status(400).json(error.message);
    }
  },

  generateID: function () {
    return nanoid();
  },
};
