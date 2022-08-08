require("dotenv").config();
const Chess = require("./logichess/main");
const express = require("express");

// setup mongoose connection
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  const game = new Chess();
  res.json(game.board);
});

app.listen(3001, () => {
  console.log("server listening on port 3001");
});
