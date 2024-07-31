const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const authRoute = require("./src/routes/auth_route");
const userRoute = require("./src/routes/user_route");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use((req, res, next) => {
  const error = new Error(req.url + " Is Not Found");
  next(error);
});

app.use((err, req, res, next) => {
  return res.status(404).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log("Server Running on http://localhost:" + PORT);
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});
