const { MongooseError } = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const route = require("express").Router();
const bcrypt = require("bcrypt");
const { generateTokenAndSetCookie } = require("../utils/token");
const { checkAuth } = require("../middleware/protected_route");

route.post("/signup", async (req, res) => {
  const { username, email, fullName, password } = req.body;
  try {
    const usernameTaken = await User.findOne({ username });
    const emailTaken = await User.findOne({ email });
    const errors = {};
    if (usernameTaken)
      errors.username = { message: "Username is already taken" };
    if (emailTaken) errors.email = { message: "Email is already taken" };
    if (usernameTaken || emailTaken) {
      return res.status(422).json({ errors });
    }
    const user = new User({ username, email, fullName, password });
    if (user) {
      generateTokenAndSetCookie({ userId: user._id, res: res });
      await user.save();
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        followers: user.followers,
        following: user.following,
        avatar: user.avatar,
        cover: user.cover,
      });
    }
  } catch (err) {
    console.log(err);
    if (err instanceof MongooseError) {
      return res.status(422).json(err);
    }
    return res.status(500).json(err.message);
  }
});

route.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const passwordMatch = await bcrypt.compare(password, user?.password || "");
    if (!user || !passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect Username or Password" });
    }
    generateTokenAndSetCookie({ userId: user._id, res: res });
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      avatar: user.avatar,
      cover: user.cover,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof MongooseError) {
      return res.status(422).json(err);
    }
    return res.status(500).json(err.message);
  }
});

route.post("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

route.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    if (err instanceof MongooseError) {
      return res.status(422).json(err);
    }
    return res.status(500).json(err.message);
  }
});

module.exports = route;
