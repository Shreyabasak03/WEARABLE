const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

const Order = require("../model/order");
const Product = require("../model/product");
const Notification = require("../model/Notification");

// =====================================================
// CREATE ORDER
// USER ONLY
// =====================================================

router.post("/", userAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        message: "You must be signed in to place an order",
      });
    }

    const { products } = req.body;

    // --------------------------------
    // VALIDATE PRODUCTS
    // --------------------------------

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    // --------------------------------
    // CHECK STOCK FIRST
    // --------------------------------

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }
    }

    // --------------------------------
    // DECREASE STOCK
    // --------------------------------

    for (const item of products) {
      const product = await Product.findById(item.product);

      product.stock -= item.quantity;

      await product.save();

      // --------------------------------
      // LOW STOCK NOTIFICATION
      // --------------------------------

      if (product.stock <= 5) {
        await Notification.create({
          type: "low_stock",
          title: "Low Stock Alert",
          message: `${product.name} has only ${product.stock} items left.`,
          relatedId: product._id.toString(),
        });
      }
    }

    // --------------------------------
    // CREATE ORDER
    // --------------------------------

    const order = new Order({
      ...req.body,

      // IMPORTANT:
      // Never trust user ID from frontend
      user: userId,
    });

    const savedOrder = await order.save();

    // --------------------------------
    // ORDER NOTIFICATION
    // --------------------------------

    await Notification.create({
      type: "order",
      title: "New Order Received",
      message: "A new order has been placed.",
      relatedId: savedOrder._id.toString(),
    });

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});


// =====================================================
// GET MY ORDERS
// USER ONLY
// =====================================================

router.get("/", userAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      user: userId,
    })
      .populate("products.product")
      .sort({ createdAt: -1 });

    // console.log("CURRENT USER ID:", userId);
    // console.log("ORDERS FOUND:", orders.length);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});


// =====================================================
// ADMIN - GET ALL ORDERS
// ADMIN ONLY
// =====================================================

router.get("/admin", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Admin get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
});


// =====================================================
// USER - GET SINGLE ORDER
// USER ONLY
// =====================================================

router.get("/:id", userAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // User can only see their own order
    if (
      !order.user ||
      order.user._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view this order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get single user order error:", error);

    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});


// =====================================================
// ADMIN - GET SINGLE ORDER
// ADMIN ONLY
// =====================================================

router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Admin get single order error:", error);

    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});


// =====================================================
// UPDATE ORDER STATUS
// ADMIN ONLY
// =====================================================

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // --------------------------------
    // RESTORE STOCK WHEN CANCELLED
    // --------------------------------

    if (
      status === "Cancelled" &&
      order.status !== "Cancelled" &&
      !order.stockRestored
    ) {
      for (const item of order.products) {
        const product = await Product.findById(item.product);

        if (product) {
          product.stock += item.quantity;

          await product.save();
        }
      }

      order.stockRestored = true;
    }

    // --------------------------------
    // UPDATE STATUS
    // --------------------------------

    order.status = status;

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);

    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
});


// =====================================================
// DELETE ORDER
// ADMIN ONLY
// =====================================================

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
});


module.exports = router;