const Message = require("../models/Message");
const Chat = require("../models/Chat");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ test: "/chat/test successful" });
});

router.post("/message/new", async (req, res) => {
  const { text, uid } = req.body;
  if (!text) return res.status(400).json("missing {text}");
  if (!uid) return res.status(400).json("missing {uid}");

  try {
    const newMessage = new Message({ text, user: uid });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
