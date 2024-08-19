const { MongooseError } = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const route = require("express").Router();
const bcrypt = require("bcrypt");
const { generateTokenAndSetCookie } = require("../utils/token");
const { checkAuth } = require("../middleware/protected_route");
const { connectMongoDB } = require("../config/mongo");

route.post("/signup", async (req, res) => {
  const { username, email, name, password } = req.body;
  try {
    connectMongoDB();
    const usernameTaken = await User.findOne({ username });
    const emailTaken = await User.findOne({ email });
    const errors = {};
    if (usernameTaken)
      errors.username = { message: "Username is already taken" };
    if (emailTaken) errors.email = { message: "Email is already taken" };
    if (usernameTaken || emailTaken) {
      return res.status(422).json({ errors });
    }
    const user = new User({ username, email, name, password });
    if (user) {
      generateTokenAndSetCookie({ userId: user._id, res: res });
      await user.save();
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImage: user.profileImage,
        coverImage: user.profileImage,
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
    connectMongoDB();
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect Username or Password" });
    }
    const passwordMatch = await bcrypt.compare(password, user?.password || "");
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect Username or Password" });
    }
    generateTokenAndSetCookie({ userId: user._id, res: res });
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
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
    connectMongoDB();
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      partitioned: true,
    });
    res.status(200).json({ message: "Logout Successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

route.get("/me", checkAuth, async (req, res) => {
  try {
    connectMongoDB();
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("following", "name username profileImage")
      .populate("followers", "name username profileImage");
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
