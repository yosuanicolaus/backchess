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
  console.log("a user just connected");

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

      if (game.state === "waiting") {
        if (game.user0.uid !== uid) {
          throw "403/user is not in the game";
        }
        // game is empty
        await game.delete();
        return res.json({ success: `game ${id} deleted` });
      }

      await game.leaveUid(uid);
      io.to(id).emit("update-game", game);
    } catch (error) {
      emitError(io, id, error);
    }
  });

  socket.on("disconnecting", () => {
    const rooms = socket.rooms.slice();
    rooms.forEach((room) => {
      io.to(room).emit("info", "a user is disconnecting");
    });

    console.log("a user just disconnected");
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
