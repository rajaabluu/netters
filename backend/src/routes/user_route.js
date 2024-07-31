const { checkAuth } = require("../middleware/protected_route");
const Notification = require("../models/notification");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/multer");

const route = require("express").Router();

route.get("/profile/:username", checkAuth, async (req, res) => {
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

route.post("/:id", checkAuth, async (req, res) => {
  try {
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
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      return res.status(200).json({ message: "User unfollowed" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      // Send Notification
      await new Notification({
        type: "FOLLOW",
        from: req.user._id,
        to: modifiedUser._id,
      }).save();
      // Return user id as response
      return res.status(200).json({ message: "User followed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

route.get("/suggested", async (req, res) => {
  try {
    const followedByMe = await User.findById(req.user._id).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: req.user._id },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const suggestedUser = users
      .filter((user) => !followedByMe.following.includes(user.id))
      .slice(0, 4);
    suggestedUser.forEach((user) => (user.password = null));

    return res.status(200).json(suggestedUser);
  } catch (error) {}
});

route.put(
  "/",
  checkAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, email, username, currentPassword, newPassword, bio, link } =
      req.body;
    let { profileImage, coverImage } = req.files;

    try {
      let user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User Not Found" });
      if (
        (!newPassword && currentPassword) ||
        (!currentPassword && newPassword)
      ) {
        return res.status(400).json({
          message: "Please provide both current password and new password",
        });
      }
      if (currentPassword && newPassword) {
        const passwordMatch = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!passwordMatch)
          return res
            .status(400)
            .json({ error: "Current Password is incorrect" });
      }

      if (profileImage) {
        // if (user.profileImage) {
        //   await cloudinary.uploader.destroy(user.profileImage.publicId);
        // }
        const result = await cloudinary.uploader.upload(profileImage[0].path, {
          folder: "profile",
        });
        profileImage = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }
      if (coverImage) {
        if (user.coverImage) {
          await cloudinary.uploader.destroy(user.coverImage.publicId);
        }
        const result = await cloudinary.uploader.upload(coverImage[0].path, {
          folder: "cover",
        });
        coverImage = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
      user.password = newPassword || user.password;
      user.bio = bio || user.bio;
      user.link = link || user.link;
      user.profileImage = profileImage || user.profileImage;
      user.coverImage = coverImage || user.coverImage;

      user = await user.save();

      user.password = null;

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = route;
