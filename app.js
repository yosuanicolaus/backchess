require("dotenv").config();
const Game = require("./models/Game");
const User = require("./models/User");
const gameRouter = require("./routes/game");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// returns all games and users in db
app.get("/", async (req, res) => {
  const games = await Game.find();
  const users = await User.find();
  res.json({ games, users });
});

app.get("/test", (req, res) => {
  console.log("test activated");

  res.json({ 0: "test" });
});

app.use("/game", gameRouter);

app.use("/user", userRouter);

app.use("/chat", chatRouter);

module.exports = app;
