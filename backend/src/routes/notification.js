const { checkAuth } = require("../middleware/protected_route");
const Notification = require("../models/notification");
const Post = require("../models/post");
const { connectMongoDB } = require("../config/mongo");

const route = require("express").Router();

// Get My Notification

route.get("/", checkAuth, async (req, res) => {
  try {
    connectMongoDB();
    const { page } = req.query;
    const itemsPerPage = 10;
    const notificationsTotal = await Notification.find({
      to: req.user._id,
    }).countDocuments({});

    const notifications = await Notification.find(
      { to: req.user._id },
      {},
      {
        skip: itemsPerPage * (page - 1),
        limit: itemsPerPage,
        sort: { createdAt: -1 },
      }
    )
      .populate("from", "username name profileImage")
      .populate({
        path: "post",
        model: Post,
        strictPopulate: false,
      });

    return res.status(200).json({
      data: notifications,
      pagination: {
        itemsPerPage,
        nextPage:
          itemsPerPage * page >= notificationsTotal && notificationsTotal !== 0
            ? parseInt(page) + 1
            : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = route;
