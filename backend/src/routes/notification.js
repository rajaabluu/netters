const { checkAuth } = require("../middleware/protected_route");
const Notification = require("../models/notification");

const route = require("express").Router();

// Get My Notification

route.get("/", checkAuth, async (req, res) => {
  try {
    const { page } = req.query;
    const itemsPerPage = 10;
    const notificationsTotal = await Notification.find({
      to: req.user._id,
    }).countDocuments({});

    const notifications = await Notification.find(
      { to: req.user._id },
      {},
      { skip: itemsPerPage * (page - 1), limit: itemsPerPage }
    ).populate("from", "username profileImage");

    return res.status(200).json({
      data: notifications,
      pagination: {
        itemsPerPage,
        nextPage: itemsPerPage * page >= notificationsTotal ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = route;
