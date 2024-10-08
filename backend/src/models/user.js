const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name field is required"],
    },
    username: {
      type: String,
      required: [true, "username field is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email field is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password field is required"],
    },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] },
    ],
    profileImage: {
      type: {
        url: String,
        publicId: String,
      },
      default: null,
    },
    coverImage: {
      type: {
        url: String,
        publicId: String,
      },
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

schema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.models.user || mongoose.model("user", schema);

module.exports = User;
