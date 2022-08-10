require("dotenv").config();
const Chess = require("./logichess/index");
const express = require("express");
const app = express();
app.use(express.json());

// setup mongoose connection
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3001, () => {
      console.log("server listening on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  console.log("get");
  console.log("params:", req.params);
  console.log("body:", req.body);
  const game = new Chess();
  res.json(game.board.board);
});

app.post("/", (req, res) => {
  console.log("post");
  console.log("params:", req.params);
  console.log("body:", req.body);
  const game = new Chess(req.body.fen);
  res.json(game.board.board);
});
