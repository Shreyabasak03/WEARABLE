const express = require("express");
const router = express.Router();

const Order = require("../model/order");

// ===============================
// CREATE ORDER
// ===============================
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    const savedOrder = await order.save();

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

// ===============================
// GET ALL ORDERS
// ===============================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE ORDER
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get single order error:", error);

    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE ORDER STATUS
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// ===============================
// DELETE ORDER
// ===============================
router.delete("/:id", async (req, res) => {
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