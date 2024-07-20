const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = ({ userId, res }) => {
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24 * 15,
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
};

module.exports = { generateTokenAndSetCookie };
