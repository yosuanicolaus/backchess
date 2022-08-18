const User = require("../models/User");
const express = require("express");
const { handleError } = require("../utils");
const router = express.Router();

// /user/test
router.get("/test", async (req, res) => {
  res.json({ test: "/user/test successful" });
});

// create new User
router.post("/new", async (req, res) => {
  const { uid } = req.body;

  try {
    const newUser = new User({ uid });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    handleError(error, res);
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
    handleError(error, res);
  }
});

module.exports = router;
