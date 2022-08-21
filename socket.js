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
  console.log("connection established with", socket.id);

  socket.on("setup", ({ uid, name }) => {
    socket.uid = uid;
    socket.name = name;
    console.log(`setup ${name} with uid ${uid}`);
  });

  const joinGame = async (id, uid) => {
    try {
      const game = await Game.findById(id);
      if (!game) throw "game not found";
      const user = await User.findById(uid);
      if (!user) throw "user not found";

      await game.joinUser(user);
      io.to(id).emit("log", `${socket.name} joined the room`);
      io.to(id).emit("update-game", game);
    } catch (error) {
      console.log("join failed", error);
      emitLog(id, error);
    }
  };

  const leaveGame = async (id, uid) => {
    try {
      const game = await Game.findById(id);
      if (!game) throw "game not found";

      await game.leaveUid(uid);
      io.to(id).emit("log", `${socket.name} left the room`);
      io.to(id).emit("update-game", game);
    } catch (error) {
      console.log("leave failed", error);
      emitLog(id, error);
    }
  };

  const emitLog = async (id, data) => {
    if (typeof data === "string") {
      io.to(id).emit("log", data);
    } else {
      io.to(id).emit("log", data.message);
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

  socket.on("disconnect", () => {
    console.log("connection severed.... with", socket.id);
  });
});

module.exports = server;
