const { default: mongoose } = require("mongoose");

exports.connectMongoDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
      process.exit(0);
    });
};
