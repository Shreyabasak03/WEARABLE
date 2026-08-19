const express = require("express");

const router = express.Router();

const Notification = require("../model/notification");

// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});


// ==========================================
// GET UNREAD COUNT
// ==========================================

router.get("/unread-count", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("UNREAD COUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
});


// ==========================================
// MARK ONE AS READ
// ==========================================

router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("MARK READ ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
});


// ==========================================
// MARK ALL AS READ
// ==========================================

router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("READ ALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
});


// ==========================================
// DELETE NOTIFICATION
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
});


module.exports = router;