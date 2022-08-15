const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  fen: String,
  pgn: String,
  history: [String],
  state: String,
  pwhite: String,
  pblack: String,
  user0: String,
  user1: String,
});

module.exports = mongoose.model("Game", gameSchema);
