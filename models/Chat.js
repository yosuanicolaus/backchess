const mongoose = require("mongoose");

const { chatSchema } = require("./schema");

module.exports = mongoose.model("Chat", chatSchema);
