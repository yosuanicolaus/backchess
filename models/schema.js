const mongoose = require("mongoose");

const message = mongoose.Schema({
  text: String,
  username: String,
  time: Date,
});

const chatSchema = mongoose.Schema({
  messages: [message],
});

const userSchema = mongoose.Schema({
  name: String,
  elo: Number,
  uid: String,
  email: String,
});

const gameSchema = mongoose.Schema({
  fen: String,
  pgn: String,
  history: [String],
  state: String,
  pwhite: String,
  pblack: String,
  user0: userSchema,
  user1: userSchema,
  timeControl: String,
  chat: chatSchema,
});

module.exports = { message, chatSchema, userSchema, gameSchema };
