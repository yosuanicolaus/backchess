const mongoose = require("mongoose");

const { playerSchema } = require("./schema");

module.exports = mongoose.model("Player", playerSchema);
