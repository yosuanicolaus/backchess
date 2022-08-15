require("dotenv").config();

const Game = require("../models/Game");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
console.log(uri);
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    Game.deleteMany().then(() => {
      console.log("deleted all games");
    });
  })
  .catch((err) => {
    console.log(err);
  });
