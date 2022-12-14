require("dotenv").config();
const User = require("./models/User");
const Chat = require("./models/Chat");
const Game = require("./models/Game");
const gameRouter = require("./routes/game");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// returns all games, users, and chats in db
app.get("/", async (req, res) => {
  const games = await Game.find();
  const users = await User.find();
  const chats = await Chat.find();
  res.json({ games, users, chats });
});

app.get("/test", (req, res) => {
  console.log("test activated");

  res.json({ 0: "test" });
});

app.use("/game", gameRouter);

app.use("/user", userRouter);

app.use("/chat", chatRouter);

module.exports = app;
