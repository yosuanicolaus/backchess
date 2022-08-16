const Chess = require("./logichess/index");
const Game = require("./models/Game");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("a user just connected");

  socket.on("join", async (gameID) => {
    socket.join(gameID);
    const game = await Game.findById(gameID);
    io.to(gameID).emit("update-game", game);
  });

  socket.on("disconnect", () => {
    console.log("a user just disconnected");
  });
});

module.exports = server;
