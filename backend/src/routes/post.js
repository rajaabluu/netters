const Post = require("../models/post");
const route = require("express").Router();
const upload = require("../middleware/multer");
const { checkAuth } = require("../middleware/protected_route");
const cloudinary = require("cloudinary").v2;

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
