const { handleError, getUser } = require("../utils");
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
    const user = new User({ uid });
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

module.exports = router;
