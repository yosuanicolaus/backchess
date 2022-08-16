require("dotenv").config();

const Game = require("../models/Game");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    Game.deleteMany().then(() => {
      console.log("deleted all games");
      process.exit();
    });
  })
  .catch((err) => {
    console.log(err);
  });
