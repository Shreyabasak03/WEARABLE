const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { clerkMiddleware } = require("@clerk/express");

// =====================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

dotenv.config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/ProductRoutes");
const orderRoutes = require("./routes/orderRoutes");
const PaymentsRoutes = require("./routes/PaymentsRoutes");
const userRoutes = require("./routes/UserRoutes");
const settingsRoutes = require("./routes/SettingsRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

// =====================================================
// CLERK AUTHENTICATION
// =====================================================

// Clerk reads the Authorization token sent by frontend
// and makes the authenticated user available to routes.

app.use(clerkMiddleware());

// =====================================================
// ROUTES
// =====================================================

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", PaymentsRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/settings",
  settingsRoutes
);
app.use("/api/notifications", notificationRoutes);

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});