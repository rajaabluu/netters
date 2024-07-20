const route = require("express").Router();

route.get("/signup", (req, res) => {
  return res.json({
    message: "This is sign up endpoint",
  });
});

route.get("/login", (req, res) => {
  return res.json({
    message: "This is login endpoint",
  });
});

module.exports = route;
