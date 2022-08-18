const Message = require("../models/Message");
const Chat = require("../models/Chat");
const express = require("express");
const { handleError } = require("../utils");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ test: "/chat/test successful" });
});

// *unused
router.post("/message/new", async (req, res) => {
  const { text, username, uid } = req.body;

  try {
    const message = new Message({ text, username, uid });
    res.json(message);
  } catch (error) {
    handleError(error, res);
  }
});

// create new chat room
router.post("/new", async (req, res) => {
  const chat = new Chat();
  await chat.save();
  res.json(chat);
});

// get chat room info
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await Chat.findById(id);
    if (!chat) throw "404/chat not found";
    res.json(chat);
  } catch (error) {
    handleError(error, res);
  }
});

// post new message to chat room
router.post("/:id/new-message", async (req, res) => {
  const { id } = req.params;
  const { text, username, uid } = req.body;

  try {
    const chat = await Chat.findById(id);
    if (!chat) throw "404/chat not found";

    const message = new Message({ text, username, uid });
    chat.messages.push(message);

    await chat.save();
    res.json(chat);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
