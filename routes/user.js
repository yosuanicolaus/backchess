const { handleError, getUser, generateName } = require("../utils");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

// /user/test
router.get("/test", async (req, res) => {
  res.json({ test: "/user/test successful" });
});

// create new User
router.post("/new", async (req, res) => {
  const { uid } = req.body;

  try {
    const name = generateName();
    const user = new User({ uid, name, _id: uid });
    await user.save();
    res.json(user);
  } catch (error) {
    handleError(error, res);
  }
});

// get user by UID
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await getUser(uid);
    res.json(user);
  } catch (error) {
    handleError(error, res);
  }
});

// get user by name
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const user = await User.find({ name });
    if (user.length === 0) throw "404/user not found";
    if (user.length > 1) throw "500/found more than 1 user";
    res.json(user);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
