const { checkAuth } = require("../middleware/protected_route");
const User = require("../models/user");

const route = require("express").Router();

route.get("/:username", checkAuth, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User Not Found" });
    return res.status(200).json(user);
  } catch (err) {
    console.log("Error In Get User :", err.message);
    return res.status(500).json({ error: err.message });
  }
});

route.post("/follow/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const modifiedUser = await User.findById(id);
  const currentUser = await User.findById(req.user._id);
  if (id === req.user._id) {
    return res
      .status(400)
      .json({ message: "You can't follow/unfollow yourself" });
  }
  if (!currentUser || !modifiedUser) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const isFollowed = currentUser.following.includes(id);
  if (isFollowed) {
    await User.findByIdAndUpdate({ _id: req.user._id }, {});
  }
});

route.put("/", checkAuth, (req, res) => {
  throw new Error("Not Implemented");
});
