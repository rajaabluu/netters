const { default: mongoose } = require("mongoose");

exports.connectMongoDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
      process.exit(0);
    });
};
