require("dotenv").config();

const Game = require("../models/Game");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
console.log(uri);
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // delete all game with no history

    Game.deleteMany({ history: [] }).then(() => {
      console.log("deleted games");
    });
  })
  .catch((err) => {
    console.log(err);
  });
