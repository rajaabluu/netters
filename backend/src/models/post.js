const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    images: {
      type: [
        {
          url: String,
          publicId: String,
        },
      ],
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    text: String,
    images: [{ publicId: String, url: String }],
    likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    comments: [Comment],
  },
  { timestamps: true }
);

const Post = mongoose.models.post || mongoose.model("post", schema);

module.exports = Post;
