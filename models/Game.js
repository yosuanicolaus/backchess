const mongoose = require("mongoose");

const { gameSchema } = require("./schema");

module.exports = mongoose.model("Game", gameSchema);
