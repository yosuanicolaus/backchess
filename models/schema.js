const { nanoid } = require("nanoid");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    elo: {
      type: Number,
      default: 800,
    },
    uid: {
      type: String,
      unique: true,
      required: true,
      minLength: 8,
    },
    email: String,
    name: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  if (this.email) {
    this.name = this.email.split("@")[0];
  } else {
    this.name = `Anonymous_${this.uid.slice(0, 8)}`;
  }
});

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
