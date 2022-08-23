const { STATE } = require("./gameData");

function createPgn(history) {
  let turn = 1;
  let half = true;
  let pgn = [];

  history.forEach((san) => {
    if (half) {
      pgn.push(`${turn}.`, san);
    } else {
      pgn.push(san);
      turn++;
    }
    half = !half;
  });

  pgn = pgn.join(" ");
  return pgn;
}

module.exports = {
  joinUser: async function (user) {
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
  },

  leaveUid: async function (uid) {
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
  },

  toggleReady: async function (uid) {
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
  },

  startGame: async function (uid) {
    if (this.state !== STATE.READY) throw "403/game state must be ready";
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
  },

  updateChessData: async function (chessData, lastMoveSan) {
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
  },
};
