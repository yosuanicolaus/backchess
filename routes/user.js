const { createUser } = require("../utils");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  console.log("userRouter received /user/test");
  res.json({ test: "successful" });
});

// create new User
router.post("/new", async (req, res) => {
  try {
    const { user } = req.body;
    const newUser = createUser(user);
    await newUser.save();
    res.json({ newUser });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
