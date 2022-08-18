const Message = require("../models/Message");
const Chat = require("../models/Chat");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ test: "/chat/test successful" });
});

module.exports = router;
