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
        image: {
          type: {
            url: String,
            publicId: String,
          },
          default: null,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        from: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "user",
        },
        to: {
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
