const express = require("express");

const router = express.Router();

const Settings = require("../model/settings");


// =====================================================
// GET SETTINGS
// =====================================================

router.get("/", async (req, res) => {
  try {

    let settings = await Settings.findOne();

    // Create default settings if none exist
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

    console.error(
      "GET SETTINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });

  }
});


// =====================================================
// UPDATE STORE SETTINGS
// =====================================================

router.put("/store", async (req, res) => {
  try {

    const {
      storeName,
      email,
      phone,
      currency,
      description,
    } = req.body;


    const settings =
      await Settings.findOneAndUpdate(
        {},

        {
          storeName,
          email,
          phone,
          currency,
          description,
        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );


    res.status(200).json({
      success: true,
      message: "Store settings updated",
      settings,
    });

  } catch (error) {

    console.error(
      "UPDATE STORE SETTINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update store settings",
    });

  }
});


// =====================================================
// UPDATE NOTIFICATIONS
// =====================================================

router.put("/notifications", async (req, res) => {
  try {

    const {
      newOrders,
      lowStock,
      newUsers,
      emailNotifications,
    } = req.body;


    const settings =
      await Settings.findOneAndUpdate(
        {},

        {
          notifications: {
            newOrders,
            lowStock,
            newUsers,
            emailNotifications,
          },
        },

        {
          new: true,
          upsert: true,
        }
      );


    res.status(200).json({
      success: true,
      message: "Notification settings updated",
      settings,
    });

  } catch (error) {

    console.error(
      "UPDATE NOTIFICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });

  }
});


// =====================================================
// UPDATE PAYMENTS
// =====================================================

router.put("/payments", async (req, res) => {
  try {

    const {
      cod,
      online,
      upi,
    } = req.body;


    const settings =
      await Settings.findOneAndUpdate(
        {},

        {
          payments: {
            cod,
            online,
            upi,
          },
        },

        {
          new: true,
          upsert: true,
        }
      );


    res.status(200).json({
      success: true,
      message: "Payment settings updated",
      settings,
    });

  } catch (error) {

    console.error(
      "UPDATE PAYMENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update payment settings",
    });

  }
});


module.exports = router;