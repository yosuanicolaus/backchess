const User = require("../models/User");
const Chat = require("../models/Chat");
const Game = require("../models/Game");

const express = require("express");
const router = express.Router();
const { generateID, handleError } = require("../utils");

router.get("/test", async (req, res) => {
  res.json({ success: "/game/test successful" });
});

router.post("/new", async (req, res) => {
  const { timeControl } = req.body;

  try {
    const chat = new Chat();
    await chat.save();

    const game = new Game({
      _id: generateID(),
      timeControl,
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
    const user = await User.findById(uid);
    if (!user) throw "404/user not found";

    await game.joinUser(user);
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

    await game.leaveUid(uid);
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
    if (game.user1.uid !== uid) throw "403/only challenger can toggle ready";

    await game.toggleReady();
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
    if (game.user0.uid !== uid) throw "403/only game owner can start the game";

    await game.startGame();
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
