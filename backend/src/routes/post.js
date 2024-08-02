const Post = require("../models/post");
const route = require("express").Router();
const upload = require("../middleware/multer");
const { checkAuth } = require("../middleware/protected_route");
const Notification = require("../models/notification");
const { default: mongoose } = require("mongoose");

route.get("/", checkAuth, async (req, res) => {
  const itemsPerPage = 10;
  const page = Math.max(0, req.query.page || 1);
  const totalPosts = await Post.countDocuments({});
  try {
    const posts = await Post.aggregate([
      {
        $match:
          req.query.type == "followed"
            ? { user: { $in: req.user.following } }
            : {},
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $skip: itemsPerPage * (page - 1),
      },
      { $limit: itemsPerPage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $project: {
          "user._id": 1,
          "user.name": 1,
          "user.profileImage": 1,
          "user.username": 1,
          text: 1,
          images: 1,
          comments: 1,
          "likes._id": 1,
          "likes.name": 1,
          "likes.username": 1,
          "likes.profileImage": 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      data: posts,
      pagination: {
        itemsPerPage,
        nextPage: totalPosts <= itemsPerPage * page ? null : page + 1,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

route.get("/:id/user", checkAuth, async (req, res) => {
  const itemsPerPage = 10;
  const page = Math.max(0, req.query.page || 1);
  try {
    const posts = await Post.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.params.id) } },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $skip: itemsPerPage * (page - 1),
      },
      { $limit: itemsPerPage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $project: {
          "user.name": 1,
          "user.profileImage": 1,
          "user.username": 1,
          text: 1,
          images: 1,
          comments: 1,
          "likes.name": 1,
          "likes.username": 1,
          "likes.profileImage": 1,
          createdAt: 1,
        },
      },
    ]);
    return res.status(200).json({
      data: posts,
      pagination: {
        itemsPerPage,
        nextPage: page + 1,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

route.post("/", checkAuth, upload.array("images", 4), async (req, res) => {
  const { text } = req.body;
  let images = [];
  try {
    if (req.files) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "posts",
        });
        images.push({ publicId: result.public_id, url: result.secure_url });
      }
    }
    const post = await new Post({
      user: req.user._id.toString(),
      text: text,
      images: images.length > 0 ? images : null,
    });

    post.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

route.post("/:id/comment", async (req, res) => {
  throw new Error("NOT IMPLEMENTED");
});

route.post("/:id/like", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post Not Found" });
    const hasLiked = post.likes.includes(req.user._id);
    if (hasLiked) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id } });
      await Notification.findOneAndDelete({ postId: post._id });
      return res.status(200).json({ message: "Post Unliked" });
    }
    await Post.findByIdAndUpdate(id, { $push: { likes: req.user._id } });
    if (post.user.toString() !== req.user._id.toString()) {
      await new Notification({
        type: "LIKE",
        from: req.user._id,
        to: post.user,
        postId: post._id,
      }).save();
    }
    return res.status(200).json({ message: "Post Liked" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

route.delete("/:id", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.images !== null) {
      for (let image of post.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
    if (post.user.toString() != req.user._id.toString())
      return res
        .status(401)
        .json({ message: "You're not permitted to do this operation" });
    await Post.findByIdAndDelete(post._id);
    return res.status(200).json({ message: "Post deleted Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = route;
