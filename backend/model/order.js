const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // JWT USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================
    // PRODUCTS PURCHASED
    // ==========================================

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // ==========================================
    // CUSTOMER INFORMATION
    // ==========================================

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ==========================================
    // SHIPPING ADDRESS
    // ==========================================

    shippingAddress: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ==========================================
    // PAYMENT
    // ==========================================

    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI"],
      default: "COD",
    },

    // ==========================================
    // TOTAL ORDER AMOUNT
    // ==========================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // ORDER STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // ==========================================
    // STOCK RESTORED
    // ==========================================

    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);