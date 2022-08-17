const { nanoid } = require("nanoid");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    elo: Number,
    uid: {
      type: String,
      unique: true,
    },
    email: String,
  },
  { _id: false }
);

const message = mongoose.Schema({
  text: String,
  user: userSchema,
  time: Date,
});

const chatSchema = mongoose.Schema({
  messages: [message],
  type: String,
  users: [userSchema],
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
  _id: {
    type: String,
    default: nanoid(10),
  },
});

module.exports = { message, chatSchema, userSchema, gameSchema };
