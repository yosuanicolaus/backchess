const { generateID, handleError, getGame, getUser } = require("../utils");
const Chat = require("../models/Chat");
const Game = require("../models/Game");

const express = require("express");
const router = express.Router();

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

router.get("/open", async (req, res) => {
  const query = { state: "waiting" };

  try {
    const games = await Game.find(query).limit(10);
    res.json(games);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const game = await getGame(id);
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
    const game = await getGame(id);
    const user = await getUser(uid);

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
    const game = await getGame(id);
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
    const game = await getGame(id);
    await game.toggleReady(uid);
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/:id/start", async (req, res) => {
  const { id } = req.params;
  const { uid } = req.body;

  try {
    const game = await getGame(id);
    await game.startGame(uid);
    res.json(game);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
