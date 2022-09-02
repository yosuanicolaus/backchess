const Game = require("./models/Game");
const {
  getGame,
  getUser,
  getChat,
  createMessage,
  checkValidPlayer,
} = require("./utils");
const Chess = require("./logichess/index");

const app = require("./app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("connection established with", socket.id);

  socket.on("setup", ({ uid, name }) => {
    socket.uid = uid;
    socket.name = name;
    socket.join(uid);
    console.log(`setup ${name} with uid ${uid}`);
  });

  const updateLobby = async (uid) => {
    const targetID = uid ? uid : "lobby";
    try {
      const openGameQuery = { state: "waiting" };
      const games = await Game.find(openGameQuery).limit(10);
      io.to(targetID).emit("update-lobby", games);
    } catch (error) {
      emitLog(targetID, error);
    }
  };

  const joinGame = async (id, uid) => {
    try {
      const game = await getGame(id);
      const user = await getUser(uid);
      await game.joinUser(user);
      if (game.state === "waiting") updateLobby();
      io.to(id).emit("log", `${socket.name} joined the room`);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitLog(id, error);
      io.to(socket.uid).emit("reload");
    }
  };

  const leaveGame = async (id, uid) => {
    try {
      const game = await getGame(id);
      await game.leaveUid(uid);
      if (game.state === "waiting" || game.state === "empty") updateLobby();
      io.to(id).emit("log", `${socket.name} left the room`);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitLog(id, error);
    }
  };

  const newMessage = async (id, text, username, uid) => {
    try {
      const chat = await getChat(id);
      const message = createMessage(text, username, uid);
      chat.messages.push(message);
      await chat.save();
      io.to(id).emit("update-chat", chat);
    } catch (error) {
      emitLog(id, error);
    }
  };

  const toggleReady = async (id, uid) => {
    try {
      const game = await getGame(id);
      await game.toggleReady(uid);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitLog(id, error);
    }
  };

  const startGame = async (id, uid) => {
    try {
      const game = await getGame(id);
      await game.startGame(uid);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitLog(id, error);
    }
  };

  const playMove = async (id, uid, move) => {
    try {
      const game = await getGame(id);
      checkValidPlayer(uid, game);
      const chess = new Chess(move.fenResult);
      await game.updateChessData(chess.data, move.san);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitLog(id, error);
    }
  };

  const emitLog = (id, data) => {
    if (typeof data === "string") {
      io.to(id).emit("log", data);
    } else {
      io.to(id).emit("log", data.message);
    }
  };

  socket.on("join", ({ id }) => {
    socket.join(id);
  });

  socket.on("leave", ({ id }) => {
    socket.leave(id);
  });

  socket.on("join-lobby", () => {
    socket.join("lobby");
    updateLobby(socket.uid);
  });

  socket.on("leave-lobby", () => {
    socket.leave("lobby");
  });

  socket.on("join-game", ({ id }) => {
    joinGame(id, socket.uid);
  });

  socket.on("leave-game", ({ id }) => {
    leaveGame(id, socket.uid);
  });

  socket.on("new-message", ({ id, text }) => {
    newMessage(id, text, socket.name, socket.uid);
  });

  socket.on("toggle", ({ id }) => {
    toggleReady(id, socket.uid);
  });

  socket.on("start", ({ id }) => {
    startGame(id, socket.uid);
  });

  socket.on("play", ({ id, move }) => {
    playMove(id, socket.uid, move);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((id) => {
      if (id?.length === 10) {
        // if it's a game id
        socket.leave(id);
        leaveGame(id, socket.uid);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("connection severed.... with", socket.id);
  });
});

module.exports = server;
