require("dotenv").config();
const Game = require("../models/Game");
const User = require("../models/User");
const Chat = require("../models/Chat");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Game.deleteMany();
    console.log("deleted all games");
    await Chat.deleteMany();
    console.log("deleted all chats");

    rl.question("delete users too? [y/N]", async (ans) => {
      if (!ans || ans.toLowerCase()[0] === "n") {
        process.exit();
      } else {
        await User.deleteMany();
        console.log("deleted all users");
        process.exit();
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
