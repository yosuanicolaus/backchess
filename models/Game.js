const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  fen: String,
  pgn: String,
  history: [String],
});

module.exports = mongoose.model("Game", gameSchema);
