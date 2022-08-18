require("dotenv").config();
const Game = require("../models/Game");
const User = require("../models/User");
const Chat = require("../models/Chat");

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Game.deleteMany();
    console.log("deleted all games");
    await User.deleteMany();
    console.log("deleted all users");
    await Chat.deleteMany();
    console.log("deleted all chats");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
