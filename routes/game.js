const User = require("../models/User");
const Chat = require("../models/Chat");
const Player = require("../models/Player");
const Game = require("../models/Game");

const express = require("express");
const router = express.Router();
const { generateID, handleError } = require("../utils");

router.get("/test", async (req, res) => {
  const game = await Game.findById("Ay513wY8St");
  game.pwhite = game.user0;
  game.pblack = game.user1;
  game.updateChessData({
    fen: "lalala",
    turn: "b",
    board: [2, 3, 4, 5],
    moves: [{ a: "e4", 2: "e5" }],
  });
  await game.save();
  res.json(game);
});

router.post("/new", async (req, res) => {
  const { timeControl, uid } = req.body;

  try {
    const user0 = await User.findById(uid);
    if (!user0) throw "404/user not found";

    const chat = new Chat();
    await chat.save();

    const game = new Game({
      _id: generateID(),
      timeControl,
      user0,
      chat: chat._id,
    });

    await game.save();
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id);
    if (!game) throw "404/game not found";
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/random/open", async (req, res) => {
  const query = { state: "waiting" };

  try {
    const total = await Game.countDocuments(query);
    if (total === 0) throw "404/no open game at the moment";

    const random = Math.floor(Math.random() * total);
    const game = await Game.findOne(query).skip(random);
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/:id/join", async (req, res) => {
  const { id } = req.params;
  const { uid } = req.body;

  try {
    const game = await Game.findById(id);
    if (!game) throw "404/game not found";
    if (game.state !== "waiting") throw "403/game is full";

    const user = await User.findById(uid);
    if (!user) throw "404/user not found";
    if (game.user0.uid === uid) throw "403/user already joined";

    game.user1 = user;
    game.state = "pending";
    await game.save();
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/:id/leave", async (req, res) => {
  const { id } = req.params;
  const { uid } = req.body;

  try {
    const game = await Game.findById(id);
    if (!game) throw "404/game not found";

    if (game.state === "waiting") {
      if (game.user0.uid !== uid) {
        throw "403/user is not in the game";
      }
      // game is empty
      await game.delete();
      return res.json({ success: `game ${id} deleted` });
    }

    if (game.user0?.uid === uid) {
      game.user0 = game.user1;
      game.user1 = undefined;
      game.state = "waiting";
    } else if (game.user1?.uid === uid) {
      game.user1 = undefined;
      game.state = "waiting";
    } else {
      throw "400/uid doesn't match either user0 or user1";
    }

    await game.save();
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/:id/ready", async (req, res) => {
  const { id } = req.params;
  const { uid } = req.body;

  try {
    const game = await Game.findById(id);
    if (!game) throw "404/game not found";
    if (game.user1.uid !== uid) throw "403/only user1 can toggle ready";

    if (game.state === "pending") {
      game.state = "ready";
    } else if (game.state === "ready") {
      game.state = "pending";
    } else {
      throw "403/game state must be either 'pending' or 'ready'";
    }
    await game.save();
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/:id/start", async (req, res) => {
  const { id } = req.params;
  const { uid } = req.body;

  try {
    const game = await Game.findById(id);
    if (!game) throw "404/game not found";
    if (game.state !== "ready") throw "403/game state must be ready";
    if (game.user0.uid !== uid) throw "403/only user0 can start the game";

    game.state = "playing";
    if (Math.random() < 0.5) {
      game.pwhite = game.user0;
      game.pblack = game.user1;
    } else {
      game.pwhite = game.user1;
      game.pblack = game.user0;
    }
    game.pwhite.active = true;
    game.pblack.active = false;
    await game.save();
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
