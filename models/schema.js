const { nanoid } = require("nanoid");
const { Schema } = require("mongoose");

const userSchema = Schema(
  {
    _id: String,
    uid: {
      type: String,
      unique: true,
      required: true,
      minLength: 8,
    },
    name: String,
    email: String,
    elo: {
      type: Number,
      default: 800,
    },
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
  this._id = this.uid;
});

const messageSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = Schema({
  messages: [messageSchema],
  type: String,
  users: [userSchema],
});

const gameSchema = Schema({
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

module.exports = { messageSchema, chatSchema, userSchema, gameSchema };
