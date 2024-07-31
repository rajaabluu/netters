const jwt = require("jsonwebtoken");
const User = require("../models/user");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token || token === undefined) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res.status(401).json({
        message: "Unauthorized User",
      });

    const user = await User.findById(decoded.userId).select("-password");

    if (!user)
      return res.status(401).json({
        message: "Unauthorized User",
      });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

module.exports = { checkAuth };
