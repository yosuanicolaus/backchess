const { createUser } = require("../utils");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

// /user/test
router.get("/test", async (req, res) => {
  try {
    console.log("received /user/test");
    const newUser = new User({
      uid: "asdfjqweru2354167",
      email: "niceemail@logichess.com",
    });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(400).json(error);
  }
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
