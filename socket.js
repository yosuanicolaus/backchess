const Chess = require("./logichess/index");
const Game = require("./models/Game");
const User = require("./models/User");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("setup", ({ uid, name }) => {
    socket.uid = uid;
    socket.username = name;
    console.log(`setup ${name} with uid ${uid}`);
  });

  const joinGame = async (id, uid) => {
    try {
      const game = await Game.findById(id);
      if (!game) throw "game not found";
      const user = await User.findById(uid);
      if (!user) throw "user not found";

      await game.joinUser(user);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitError(io, id, error);
    }
  };

  const leaveGame = async (id, uid) => {
    try {
      const game = await Game.findById(id);
      if (!game) throw "game not found";

      await game.leaveUid(uid);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitError(io, id, error);
    }
  };

  socket.on("join", async ({ id }) => {
    socket.join(id);
    joinGame(id, socket.uid);
  });

  socket.on("leave", async ({ id }) => {
    socket.leave(id);
    leaveGame(id, socket.uid);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach(async (id) => {
      if (id.length === 10) {
        // if it's a game id
        socket.leave(id);
        leaveGame(id, socket.uid);
      }
    });
  });
});

function emitError(io, room, error) {
  if (typeof error === "string") {
    io.to(room).emit("error", error);
  } else {
    io.to(room).emit("error", error.message);
  }
}

module.exports = server;
