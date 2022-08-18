const mongoose = require("mongoose");

const { messageSchema } = require("./schema");

module.exports = mongoose.model("Message", messageSchema);
