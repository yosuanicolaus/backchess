const User = require("../models/User");
const Chat = require("../models/Chat");
const Player = require("../models/Player");
const Game = require("../models/Game");

const express = require("express");
const router = express.Router();
const { generateID, handleError } = require("../utils");

router.get("/test", (req, res) => {
  res.json({ test: "/game test successful" });
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
    const user = await User.findById(uid);
    if (!game) throw "404/game not found";
    if (!user) throw "404/user not found";

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

module.exports = router;
