require("dotenv").config();
const Chess = require("./logichess/index");
const Game = require("./models/Game");
const TestChess = require("./models/TestChess");
const express = require("express");
const app = express();
app.use(express.json());

// setup mongoose connection
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3001, () => {
      console.log("server listening on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", async (req, res) => {
  console.log("get /");
  console.log("params:", req.params);
  console.log("body:", req.body);
  const games = await Game.find();
  res.json(games);
});

app.post("/", (req, res) => {
  console.log("post /");
  console.log("params:", req.params);
  console.log("body:", req.body);
  const game = new Chess(req.body.fen);
  res.json(game.board.board);
});

app.post("/new/game", async (req, res) => {
  console.log("post /new/game");
  let { fen, pgn } = req.body;

  if (!fen) {
    return res.status(400).json({ message: "{fen} is required!" });
  }
  if (!pgn) {
    pgn = "";
  }

  const game = new Game({
    fen: fen,
    pgn: pgn,
  });
  await game.save();
  res.json(game);
});

app.post("/test", async (req, res) => {
  let { fen } = req.body;
  if (!fen) return res.status(400).json("pls include {fen}");

  const chess = new Chess(fen);
  const game = new TestChess({
    chess: chess,
  });
  game.save();
  res.json(game);
});

app.get("/test", async (req, res) => {
  const games = await TestChess.find();
  res.json(games);
});
