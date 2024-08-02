const mongoose = require("mongoose");

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
    comments: [
      {
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
        createdAt: {
          type: mongoose.SchemaTypes.Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.models.post || mongoose.model("post", schema);

module.exports = Post;
