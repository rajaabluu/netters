const Post = require("../models/post");
const route = require("express").Router();
const upload = require("../middleware/multer");
const { checkAuth } = require("../middleware/protected_route");
const Notification = require("../models/notification");
const { default: mongoose } = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Get All / Followed Users Post
route.get("/", checkAuth, async (req, res) => {
  const itemsPerPage = 10;
  const page = Math.max(0, req.query.page || 1);
  const totalPosts = await Post.countDocuments({});
  try {
    const posts = await Post.aggregate([
      {
        $match:
          req.query.type == "following"
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
        $unwind: "$user",
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
          commentsCount: 1,
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
        nextPage: itemsPerPage * page >= totalPosts ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get User Post
route.get("/:id/user", checkAuth, async (req, res) => {
  const itemsPerPage = 10;
  const page = Math.max(0, req.query.page || 1);
  const totalPosts = await Post.find({ user: req.params.id }).countDocuments(
    {}
  );
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
        $unwind: "$user",
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
          commentsCount: 1,
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
        nextPage: itemsPerPage * page >= totalPosts ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get User Liked Post

route.get("/:id/user/likes", checkAuth, async (req, res) => {
  const itemsPerPage = 10;
  const page = Math.max(0, req.query.page || 1);
  const totalPosts = await Post.find({
    likes: { $in: [new mongoose.Types.ObjectId(req.params.id)] },
  }).countDocuments({});
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          likes: { $in: [new mongoose.Types.ObjectId(req.params.id)] },
        },
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
        $unwind: "$user",
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
          commentsCount: 1,
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
        nextPage: itemsPerPage * page >= totalPosts ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get Post Detail
route.get("/:id", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name username profileImage")
      .populate("likes", "name username profileImage")
      .populate("comments.from", "name username profileImage")
      .populate("comments.to", "name username profileImage");
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create Post
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
    console.log(err);

    return res.status(500).json({ message: err.message });
  }
});

// Comment on post
route.post(
  "/:id/comment",
  checkAuth,
  upload.array("images", 4),
  async (req, res) => {
    try {
      let images = [];
      if (!req.body.text) {
        return res.status(422).json({ message: "Text Is Required" });
      }
      if (!!req.files) {
        for (let image of req.files) {
          const result = await cloudinary.uploader.upload(image, {
            folder: "comments",
          });
          images.push({ url: result.secure_url, publicId: result.public_id });
        }
      }
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post Not Found" });
      post.comments.push({
        from: req.user._id,
        to: req.body.to,
        text: req.body.text,
        images: images,
      });
      await post.save();
      await new Notification({
        type: "comment",
        postId: post._id,
        from: req.user._id,
        to: post.user,
        text: req.body.text,
      }).save();
      return res.status(200).json({ message: "Success Comment on Post" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

// Like Post
route.post("/:id/like", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post Not Found" });
    const hasLiked = post.likes.includes(req.user._id);
    if (hasLiked) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id } });
      await Notification.findOneAndDelete({
        type: "like",
        from: req.user._id,
        to: post.user,
        post: post._id,
      });
      return res.status(200).json({ message: "Post Unliked" });
    }
    await Post.findByIdAndUpdate(id, { $push: { likes: req.user._id } });
    if (post.user.toString() !== req.user._id.toString()) {
      await new Notification({
        type: "like",
        from: req.user._id,
        to: post.user,
        post: post._id,
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

    await Notification.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);
    return res.status(200).json({ message: "Post deleted Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = route;
