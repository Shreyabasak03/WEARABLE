const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/ProductRoutes");
const orderRoutes = require("./routes/orderRoutes");
const PaymentsRoutes = require("./routes/PaymentsRoutes");
const userRoutes = require("./routes/UserRoutes");
const settingsRoutes = require("./routes/SettingsRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const authRoutes = require("./routes/AuthRoutes");

const app = express();

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// ROUTES
// ===============================

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", PaymentsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});