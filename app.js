require("dotenv").config();
const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const Chess = require("./logichess/index");
const Game = require("./models/Game");
const express = require("express");
const cors = require("cors");
const { createPgn } = require("./utils");

const app = express();
app.use(express.json());
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// setup mongoose connection
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(3001, () => {
      console.log("server listening on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });

io.on("connection", () => {
  console.log("a user just connected");
});

// returns all games in db
app.get("/", async (req, res) => {
  const games = await Game.find();
  res.json({ games });
});

// create and store new game
// req.body {fen, pgn, history} is optional
app.post("/game/new", async (req, res) => {
  const { fen = defaultFen, history = [], username } = req.body;
  if (!username) {
    return res.status(400).json("please include {username} in req body");
  }
  const game = new Game({
    fen,
    history,
    pgn: createPgn(history),
    user0: username,
    state: "pending",
  });
  await game.save();
  res.json({ game });
});

// get game from database
app.get("/game/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    res.json({ game });
  } catch (error) {
    return res.status(400).json(error);
  }
});

// join game
app.post("/game/:id/join", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) {
    return res.status(400).json("please include {username} in req body");
  }
  try {
    const game = await Game.findById(id);
    if (game?.user1) {
      return res.status(403).json("can't join, room is full");
    } else {
      game.user1 = username;
    }
    await game.save();
    res.json({ game });
  } catch (error) {
    return res.status(400).json(error);
  }
});

// leave game
app.post("/game/:id/leave", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) {
    return res.status(400).json("please include {username} in req body");
  }
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(400).json("can't find game with that id");
    }

    if (username === game.user0) {
      game.user0 = null;
    } else if (username === game.user1) {
      game.user1 = null;
    } else {
      return res.status(400).json("can't find user in this game");
    }

    if (!game.user1 && !game.user0) {
      // room empty, delete game
      await game.delete();
      return res.json(`empty room, game ${id} deleted`);
    }

    if (!game.user0 && game.user1) {
      game.user0 = game.user1;
      game.user1 = null;
    }

    if (game.state === "playing") {
      // end game
      game.state = "end";
    }

    await game.save();
    res.json({ game });
  } catch (error) {
    return res.status(400).json(error);
  }
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
