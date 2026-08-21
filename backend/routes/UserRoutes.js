const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const User = require("../model/user");
const Order = require("../model/order");

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

router.get("/", adminAuth, async (req, res) => {
  try {
    // =================================================
    // GET USERS FROM MONGODB
    // =================================================

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // =================================================
    // GET ORDERS FROM MONGODB
    // =================================================

    const orders = await Order.find({}).lean();

    // =================================================
    // CREATE USER ORDER STATISTICS
    // =================================================

    const orderStats = {};

    orders.forEach((order) => {
      if (!order.user) {
        return;
      }

      const userId = order.user.toString();

      if (!orderStats[userId]) {
        orderStats[userId] = {
          orders: 0,
          spent: 0,
          phone: "",
        };
      }

      // Count order
      orderStats[userId].orders += 1;

      // Add total spent
      orderStats[userId].spent +=
        Number(order.totalAmount) || 0;

      // Get phone from order
      if (
        !orderStats[userId].phone &&
        order.customer?.phone
      ) {
        orderStats[userId].phone =
          order.customer.phone;
      }
    });

    // =================================================
    // COMBINE USER + ORDER DATA
    // =================================================

    const formattedUsers = users.map((user) => {
      const userId = user._id.toString();

      const stats =
        orderStats[userId] || {
          orders: 0,
          spent: 0,
          phone: "",
        };

      // =================================================
      // PHONE
      // =================================================

      const phone =
        user.phone ||
        stats.phone ||
        "Not provided";

      // =================================================
      // STATUS
      // =================================================

      const status = user.isBlocked
        ? "Blocked"
        : "Active";

      // =================================================
      // RETURN USER
      // =================================================

      return {
        id: user._id,

        name: user.name || "No name",

        email: user.email || "No email",

        phone,

        imageUrl: user.imageUrl || null,

        orders: stats.orders,

        spent: stats.spent,

        joined: user.createdAt,

        status,
      };
    });

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      users: formattedUsers,
      totalCount: formattedUsers.length,
    });

  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

module.exports = router;