require("dotenv").config();
const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const Chess = require("./logichess/index");
const Game = require("./models/Game");
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

app.post("/game/new", async (req, res) => {
  console.log("post /game/new");
  const { fen = defaultFen, pgn = "", history = [] } = req.body;
  const game = new Game({
    fen,
    pgn,
    history,
  });
  await game.save();
  res.json(game);
});

app.get("/game/:id/moves", async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    const chess = new Chess(game.fen);
    res.json(chess.getMoves());
  } catch (error) {
    return res.status(400).json("game id not found!");
  }
});
