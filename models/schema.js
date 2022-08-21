const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const { createPgn, generateID } = require("../utils");
const { Schema } = require("mongoose");

const STATE = {
  EMPTY: "empty",
  WAITING: "waiting",
  PENDING: "pending",
  READY: "ready",
  PLAYING: "playing",
  ENDED: "ended",
};

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
  online: { type: Boolean, default: true },
  // TODO: implement player's timer
  // time: { type: Number, required: true },
  // record: [Date]
});

const gameSchema = Schema(
  {
    _id: String,
    fen: { type: String, default: defaultFen },
    pgn: { type: String, default: "" },
    timeControl: { type: String, required: true },
    state: { type: String, default: STATE.EMPTY },
    turn: { type: String, default: "w" },
    board: [[Number]],
    history: [String],
    moves: Array,
    pwhite: playerSchema,
    pblack: playerSchema,
    user0: userSchema,
    user1: userSchema,
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

gameSchema.methods.joinUser = async function (user) {
  if (this.user0?.uid === user.uid || this.user1?.uid === user.uid) return;

  if (this.state === STATE.EMPTY) {
    this.user0 = user;
    this.state = STATE.WAITING;
  } else if (this.state === STATE.WAITING) {
    this.user1 = user;
    this.state = STATE.PENDING;
  } else if (this.state === STATE.PENDING || this.state === STATE.READY) {
    throw "403/game is full";
  } else {
    // if game is playing / ended
    if (this.pwhite.uid === user.uid) {
      this.pwhite.online = true;
    } else if (this.pblack.uid === user.uid) {
      this.pblack.online = true;
    } else {
      throw "403/game is already playing";
    }
  }
  await this.save();
};

gameSchema.methods.leaveUid = async function (uid) {
  if (!uid) throw "400/uid must be defined";
  if (this.user0?.uid !== uid && this.user1?.uid !== uid) return;

  if (this.state === STATE.EMPTY) {
    throw "400/game is already empty";
  } else if (this.state === STATE.WAITING) {
    this.user0 = undefined;
    this.state = STATE.EMPTY;
  } else if (this.state === STATE.PENDING || this.state === STATE.READY) {
    if (this.user0.uid === uid) {
      this.user0 = this.user1;
      this.user1 = undefined;
      this.state = STATE.WAITING;
    } else if (this.user1.uid === uid) {
      this.user1 = undefined;
      this.state = STATE.WAITING;
    }
  } else {
    // if game is playing / ended
    if (this.pwhite.uid === uid) {
      this.pwhite.online = false;
    } else if (this.pblack.uid === uid) {
      this.pblack.online = false;
    }
  }
  await this.save();
};

gameSchema.methods.toggleReady = async function (uid) {
  if (this.user1.uid !== uid) {
    throw "403/only challenger can toggle ready";
  }

  if (this.state === STATE.PENDING) {
    this.state = STATE.READY;
  } else if (this.state === STATE.READY) {
    this.state = STATE.PENDING;
  } else {
    throw "403/game state must be either 'pending' or 'ready'";
  }
  await this.save();
};

gameSchema.methods.startGame = async function (uid) {
  if (this.state !== "ready") throw "403/game state must be ready";
  if (this.user0.uid !== uid) throw "403/only game owner can start the game";

  this.state = STATE.PLAYING;
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
  if (this.state !== STATE.PLAYING) throw "game is not playing";
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
