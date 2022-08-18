const Message = require("../models/Message");
const Chat = require("../models/Chat");
const express = require("express");
const { handleError } = require("../utils");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ test: "/chat/test successful" });
});

router.post("/message/new", async (req, res) => {
  const { text, username, uid } = req.body;

  try {
    const newMessage = new Message({ text, username, uid });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/message/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) throw "404/message not found";
    res.json(message);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
