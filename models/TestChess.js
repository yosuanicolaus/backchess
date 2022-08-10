const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  id: mongoose.Types.ObjectId,
  chess: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("TestChess", testSchema);
