const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const { createPgn } = require("../utils");
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
    elo: { type: Number, default: 800 },
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
    text: { type: String, required: true },
    username: { type: String, required: true },
    uid: { type: String, required: true },
  },
  { timestamps: true }
);

const chatSchema = Schema({
  messages: [messageSchema],
});

const playerSchema = Schema({
  name: { type: String, required: true },
  elo: { type: Number, required: true },
  uid: { type: String, required: true },
  active: { type: Boolean, required: true },
  // TODO: implement player's timer
  // time: { type: Number, required: true },
  // record: [Date]
});

const gameSchema = Schema({
  fen: { type: String, default: defaultFen },
  pgn: { type: String, default: "" },
  timeControl: { type: String, required: true },
  state: { type: String, default: "waiting" },
  turn: { type: String, default: "w" },
  board: [[Number]],
  history: [String],
  moves: Array,
  pwhite: playerSchema,
  pblack: playerSchema,
  user0: userSchema,
  user1: userSchema,
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  _id: {
    type: String,
    default: nanoid(10),
  },
});

gameSchema.pre("save", function () {
  this.pgn = createPgn(this.history);

  if (this.state === "playing") {
    this.pwhite.active = this.turn === "w";
    this.pblack.active = this.turn === "b";
  }
});

module.exports = {
  messageSchema,
  chatSchema,
  userSchema,
  playerSchema,
  gameSchema,
};
