const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  
  {
    
    // ==========================================
    // CLERK USER
    // ==========================================

    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },

    
    // Products purchased in this order
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

    // Customer information
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

    // Shipping address
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

    // Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI"],
      default: "COD",
    },

    // Total order amount
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order status
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