const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema(
  {
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["FOLLOW", "LIKE"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: false }
);

const Notification =
  mongoose.models.notification || mongoose.model("notification", schema);

module.exports = Notification;
