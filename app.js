const Chess = require("./logichess/main");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const game = new Chess();
  res.json(game.board);
});

app.listen(3001, () => {
  console.log("server listening on port 3001");
});
