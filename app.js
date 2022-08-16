require("dotenv").config();
const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const Game = require("./models/Game");
const express = require("express");
const cors = require("cors");
const { createPgn } = require("./utils");

const app = express();
app.use(express.json());
app.use(cors());

// returns all games in db
app.get("/", async (req, res) => {
  const games = await Game.find();
  res.json({ games });
});

// create and store new game
// req.body { username } is mandatory
app.post("/game/new", async (req, res) => {
  const {
    fen = defaultFen,
    history = [],
    timeControl = "10+0",
    username,
  } = req.body;
  if (!username) return res.status(400).json("include {username} in req body");

  const game = new Game({
    fen,
    history,
    timeControl,
    pgn: createPgn(history),
    user0: username,
    user1: null,
    pwhite: null,
    pblack: null,
    state: "pending",
  });
  await game.save();
  res.json({ game });
});

// get game from database
app.get("/game/:id", (req, res) => {
  const { id } = req.params;
  Game.findById(id)
    .then((game) => {
      if (!game) return res.status(404).json("game not found");
      res.json({ game });
    })
    .catch(() => {
      res.status(404).json("game not found");
    });
});

// join game, mandatory {username}
app.post("/game/:id/join", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) return res.status(400).json("include {username} in req body");

  Game.findById(id)
    .then((game) => {
      if (!game) return res.status(404).json("game not found");
      if (game?.user1) return res.status(403).json("can't join, room is full");
      game.user1 = username;
      game.save().then(() => res.json({ game }));
    })
    .catch(() => {
      res.status(404).json("game not found");
    });
});

// leave game
app.post("/game/:id/leave", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) return res.status(400).json("include {username} in req body");

  Game.findById(id)
    .then((game) => {
      if (!game) return res.status(404).json("game not found");

      if (username === game.user0) {
        game.user0 = null;
      } else if (username === game.user1) {
        game.user1 = null;
      } else {
        return res.status(400).json("can't find that user in this game");
      }

      let emptyFlag = false;
      if (!game.user0 && !game.user1) {
        emptyFlag = true;
        game.delete().then(() => {
          res.json(`empty room, game ${id} deleted`);
        });
      }
      if (emptyFlag) return;

      if (!game.user0 && game.user1) {
        game.user0 = game.user1;
        game.user1 = null;
      }

      game.save().then(() => res.json(game));
    })
    .catch(() => {
      res.status(404).json("game not found");
    });
});

/* both route below are going to be replaced with
socket io realtime data connection

// get possible moves in a game
app.get("/game/:id/moves", async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    const chess = new Chess(game.fen);
    const moves = chess.getMoves();
    res.json({ moves });
  } catch (error) {
    return res.status(400).json("game id not found!");
  }
});

// make a move in game
app.post("/game/:id/move", async (req, res) => {
  const { id } = req.params;
  const { move } = req.body;
  if (!move) {
    return res.status(400).json("add {move} to request body");
  }
  try {
    const game = await Game.findById(id);
    const chess = new Chess(game.fen);
    chess.play(move);
    const moves = chess.getMoves();
    game.fen = chess.fen.fen;
    game.history.push(move.san);
    game.save();
    res.json({ game, moves });
  } catch (error) {
    return res.status(400).json("can't find game with that id");
  }
});

*/

app.get("/test", (req, res) => {
  console.log("test activated");

  res.json({ 0: "test" });
});

module.exports = app;
