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

// create and store new game
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
    res.json({ game });
  } catch (error) {
    handleError(error, res);
  }
});

// get game from database
router.get("/:id", (req, res) => {
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

// get random joinable game
router.get("/random/open", (req, res) => {
  const query = { state: "waiting" };
  Game.countDocuments(query, (error, total) => {
    if (error) {
      return res.json(error.message);
    }
    const randIdx = Math.floor(Math.random() * total);
    Game.findOne(query)
      .skip(randIdx)
      .exec((error, game) => {
        if (error) return res.status(400).json(error.message);
        if (!game)
          return res.status(404).json("There is no open game at the moment");

        res.json({ game });
      });
  });
});

// join game, mandatory {username}
router.post("/:id/join", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) return res.status(400).json("include {username} in req body");
  // TODO: Game model now store user0 & user1 as User model
  // which requires {name, elo, uid, email}
  // make changes accordingly

  Game.findById(id)
    .then((game) => {
      if (!game) return res.status(404).json("game not found");
      if (game?.user1) return res.status(403).json("can't join, room is full");
      game.user1 = username;
      game.state = "pending";
      game.save().then(() => res.json({ game }));
    })
    .catch(() => {
      res.status(404).json("game not found");
    });
});

// leave game
router.post("/:id/leave", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) return res.status(400).json("include {username} in req body");
  // TODO: Game model now store user0 & user1 as User model
  // which requires {name, elo, uid, email}
  // make changes accordingly

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

      game.state = "waiting";
      game.save().then(() => res.json(game));
    })
    .catch(() => {
      res.status(404).json("game not found");
    });
});

module.exports = router;
