const { Schema } = require("mongoose");
const { STATE } = require("./gameData");
const {
  joinUser,
  leaveUid,
  startGame,
  toggleReady,
  updateChessData,
} = require("./gameMethods");

const userSchema = Schema(
  {
    _id: String,
    uid: {
      type: String,
      required: true,
      minLength: 8,
    },
    name: { type: String, required: true },
    email: String,
    elo: { type: Number, default: 800 },
  },
  { timestamps: true }
);

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
  time: Number,
});

const gameSchema = Schema(
  {
    _id: String,
    timeControl: { type: String, required: true },
    state: { type: String, default: STATE.EMPTY },
    status: String,
    turn: String,
    fen: String,
    board: [[String]],
    moves: Array,
    history: [String],
    records: [Number],
    pgn: String,
    pwhite: playerSchema,
    pblack: playerSchema,
    user0: userSchema,
    user1: userSchema,
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
    methods: {
      joinUser,
      leaveUid,
      startGame,
      toggleReady,
      updateChessData,
    },
  }
);

module.exports = {
  messageSchema,
  chatSchema,
  userSchema,
  playerSchema,
  gameSchema,
};
