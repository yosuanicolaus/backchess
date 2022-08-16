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

  socket.on("test", (data) => {
    console.log("test received!");
    console.log(data);
    io.emit("test", data);
  });

  socket.on("disconnect", () => {
    console.log("a user just disconnected");
  });
});

module.exports = server;
