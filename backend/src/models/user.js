const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
});

const User = mongoose.models.user || mongoose.model("user", schema);

module.exports = User;
