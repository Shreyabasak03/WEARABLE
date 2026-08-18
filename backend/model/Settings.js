const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "Wearable",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "INR",
    },

    description: {
      type: String,
      default: "",
    },

    notifications: {
      newOrders: {
        type: Boolean,
        default: true,
      },

      lowStock: {
        type: Boolean,
        default: true,
      },

      newUsers: {
        type: Boolean,
        default: true,
      },

      emailNotifications: {
        type: Boolean,
        default: false,
      },
    },

    payments: {
      cod: {
        type: Boolean,
        default: true,
      },

      online: {
        type: Boolean,
        default: true,
      },

      upi: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Settings",
  settingsSchema
);