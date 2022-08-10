const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  id: mongoose.Types.ObjectId,
  fen: String,
  pgn: String,
  history: [String],
});

module.exports = mongoose.model("Game", gameSchema);
