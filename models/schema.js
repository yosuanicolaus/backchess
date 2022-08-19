const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const { createPgn, generateID } = require("../utils");
const { Schema } = require("mongoose");

const userSchema = Schema(
  {
    _id: String,
    uid: {
      type: String,
      required: true,
      minLength: 8,
    },
    name: String,
    email: String,
    elo: { type: Number, default: 800 },
  },
  { timestamps: true }
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
  _id: String,
  name: { type: String, required: true },
  elo: { type: Number, required: true },
  uid: { type: String, required: true },
  active: { type: Boolean, required: true },
  // TODO: implement player's timer
  // time: { type: Number, required: true },
  // record: [Date]
});

const gameSchema = Schema({
  _id: String,
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
});

gameSchema.methods.toggleReady = async function () {
  if (this.state === "pending") {
    this.state = "ready";
  } else if (this.state === "ready") {
    this.state = "pending";
  } else {
    throw "403/game state must be either 'pending' or 'ready'";
  }
  await this.save();
};

gameSchema.methods.startGame = async function () {
  this.state = "playing";
  if (Math.random() < 0.5) {
    this.pwhite = this.user0;
    this.pblack = this.user1;
  } else {
    this.pwhite = this.user1;
    this.pblack = this.user0;
  }
  this.pwhite.active = true;
  this.pblack.active = false;
  await this.save();
};

gameSchema.methods.updateChessData = async function (chessData, lastMoveSan) {
  const { fen, turn, board, moves } = chessData;
  this.fen = fen;
  this.turn = turn;
  this.board = board;
  this.moves = moves;
  this.history.push(lastMoveSan);
  this.pgn = createPgn(this.history);
  this.pwhite.active = this.turn === "w";
  this.pblack.active = this.turn === "b";
  await this.save();
};

module.exports = {
  messageSchema,
  chatSchema,
  userSchema,
  playerSchema,
  gameSchema,
};
