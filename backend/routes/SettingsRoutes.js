const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // or bcryptjs depending on your package.json
const adminAuth = require("../middleware/adminAuth");
const Settings = require("../model/Settings");
const Admin = require("../model/Admin");

// =====================================================
// GET SETTINGS
// =====================================================
router.get("/", adminAuth, async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        storeName: "Wearable",
        email: "admin@wearable.com",
        phone: "+91 98765 43210",
        currency: "INR",
        description:
          "Wearable is an online fashion store offering modern clothing and accessories.",
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
});

// =====================================================
// UPDATE STORE SETTINGS
// =====================================================
router.put("/store", adminAuth, async (req, res) => {
  try {
    const { storeName, email, phone, currency, description } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      { storeName, email, phone, currency, description },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Store settings updated",
      settings,
    });
  } catch (error) {
    console.error("UPDATE STORE SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update store settings",
    });
  }
});

// =====================================================
// UPDATE NOTIFICATIONS
// =====================================================
router.put("/notifications", adminAuth, async (req, res) => {
  try {
    const { newOrders, lowStock, newUsers, emailNotifications } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      {
        notifications: {
          newOrders,
          lowStock,
          newUsers,
          emailNotifications,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Notification settings updated",
      settings,
    });
  } catch (error) {
    console.error("UPDATE NOTIFICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
});

// =====================================================
// UPDATE PAYMENTS
// =====================================================
router.put("/payments", adminAuth, async (req, res) => {
  try {
    const { cod, online, upi } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      {
        payments: {
          cod,
          online,
          upi,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment settings updated",
      settings,
    });
  } catch (error) {
    console.error("UPDATE PAYMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment settings",
    });
  }
});

// =====================================================
// UPDATE PROFILE
// =====================================================
router.put("/profile", adminAuth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    admin.name = name.trim();
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        image: admin.image,
      },
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
});

// =====================================================
// UPDATE PASSWORD
// =====================================================
router.put("/password", adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("PASSWORD UPDATE ERROR:", error);
    res.status(500).json({
      message: "Failed to update password",
    });
  }
});

module.exports = router;