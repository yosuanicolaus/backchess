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

router.get("/message/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json("message not found");

    await message.populate("user");
    res.json(message);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
