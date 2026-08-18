const express = require("express");
const router = express.Router();

const { clerkClient, getAuth } = require("@clerk/express");
const Order = require("../model/order");

// =====================================================
// GET ALL USERS
// =====================================================

router.get("/", async (req, res) => {
  try {
    // =================================================
    // CHECK ADMIN AUTHENTICATION
    // =================================================

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // =================================================
    // GET USERS FROM CLERK
    // =================================================

    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    });

    // =================================================
    // GET ORDERS FROM MONGODB
    // =================================================

    const orders = await Order.find({}).lean();

    // console.log("Total orders in MongoDB:", orders.length);

    // =================================================
    // CREATE USER ORDER STATISTICS
    // =================================================
const orderStats = {};

orders.forEach((order) => {

  if (!order.clerkUserId) {
    return;
  }

  const clerkId = order.clerkUserId;

  if (!orderStats[clerkId]) {
    orderStats[clerkId] = {
      orders: 0,
      spent: 0,
      phone: "",
    };
  }

  // Count order
  orderStats[clerkId].orders += 1;

  // Add total spent
  orderStats[clerkId].spent +=
    Number(order.totalAmount) || 0;

  // Get phone from order
  if (
    !orderStats[clerkId].phone &&
    order.customer?.phone
  ) {
    orderStats[clerkId].phone =
      order.customer.phone;
  }
});

    // console.log("Order statistics:", orderStats);

    // =================================================
    // COMBINE CLERK + MONGODB DATA
    // =================================================

    const users = clerkUsers.data.map((user) => {
        

      const stats =
        orderStats[user.id] || {
          orders: 0,
          spent: 0,
        };

      // =================================================
      // NAME
      // =================================================

      const name =
        [user.firstName, user.lastName]
          .filter(Boolean)
          .join(" ") || "No name";


      // =================================================
      // EMAIL
      // =================================================

      const email =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "No email";


      // =================================================
      // PHONE
      // =================================================

      const phone =
  user.primaryPhoneNumber?.phoneNumber ||
  user.phoneNumbers?.[0]?.phoneNumber ||
  stats.phone ||
  "Not provided";
      // =================================================
      // STATUS
      // =================================================

      const status = user.banned
        ? "Blocked"
        : "Active";


      // =================================================
      // RETURN USER
      // =================================================

      return {

        id: user.id,

        name,

        email,

        phone,

        imageUrl: user.imageUrl,

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

      users,

      totalCount:
        clerkUsers.totalCount ||
        users.length,

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