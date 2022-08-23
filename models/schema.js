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
    timeControl: { type: String, required: true },
    state: { type: String, default: STATE.EMPTY },
    turn: String,
    fen: String,
    board: [[String]],
    moves: Array,
    history: [String],
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
