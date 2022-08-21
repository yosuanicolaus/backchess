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

  socket.on("join", async ({ id, uid }) => {
    try {
      socket.join(id);
      const game = await Game.findById(id);
      if (!game) throw "game not found";
      const user = await User.findById(uid);
      if (!user) throw "user not found";

      await game.joinUser(user);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitError(io, id, error);
    }
  });

  socket.on("leave", async ({ id, uid }) => {
    try {
      socket.leave(id);
      const game = await Game.findById(id);
      if (!game) throw "game not found";

      await game.leaveUid(uid);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitError(io, id, error);
    }
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach(async (id) => {
      if (id.length === 10) {
        // if it's a game id
        const uid = socket.uid;

        try {
          socket.leave(id);
          const game = await Game.findById(id);
          if (!game) throw "game not found";

          await game.leaveUid(uid);
          io.to(id).emit("update-game", game);
        } catch (error) {
          emitError(io, id, error);
        }
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
