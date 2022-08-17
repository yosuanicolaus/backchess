require("dotenv").config();
const Game = require("../models/Game");
const User = require("../models/User");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Game.deleteMany();
    console.log("deleted all games");
    await User.deleteMany();
    console.log("deleted all users");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
