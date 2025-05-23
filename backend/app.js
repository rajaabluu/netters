const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const postRoute = require("./src/routes/post");
const notificationRoute = require("./src/routes/notification");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

dotenv.config();
const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (_, res) => res.send("Hello World!"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/notification", notificationRoute);

app.use((req, _, next) => {
  const error = new Error(req.url + " Is Not Found");
  next(error);
});

app.use((err, _, res, __) => {
  return res.status(404).json({
    message: err.message,
  });
});

app.listen(PORT, () =>
  console.log("Server Running on http://localhost:" + PORT)
);
