const { createUser } = require("../utils");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

// /user/test
router.get("/test", async (req, res) => {
  try {
    console.log("received /user/test");
    const user = await User.findById("qwertywarrior12345678");
    if (!user) return res.status(404).json("user not found");
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// create new User
router.post("/new", async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json("missing {uid}");

  try {
    const newUser = new User({ uid });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// get user by UID
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findById(uid);
    if (!user) return res.status(404).json("user not found");
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
