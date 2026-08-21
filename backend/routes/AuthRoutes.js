const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../model/user");
const Admin = require("../model/Admin");

const {
  generateUserToken,
  generateAdminToken,
} = require("../utils/generateToken");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();


// =====================================================
// USER - CHECK AUTHENTICATION
// GET /api/auth/me
// =====================================================

router.get("/me", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("User me error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================================================
// ADMIN - CHECK AUTHENTICATION
// GET /api/auth/admin/me
// =====================================================

router.get("/admin/me", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("Admin me error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================================================
// USER - REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {
  try {
    // console.log("REGISTER ROUTE HIT");
    // console.log("BODY:", req.body);

    const {
      name,
      email,
      password,
    } = req.body;

    // -----------------------------------------
    // VALIDATE INPUT
    // -----------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // -----------------------------------------
    // CHECK EXISTING USER
    // -----------------------------------------

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // -----------------------------------------
    // HASH PASSWORD
    // -----------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -----------------------------------------
    // CREATE USER
    // -----------------------------------------

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // -----------------------------------------
    // CREATE USER TOKEN
    // -----------------------------------------

    const token = generateUserToken(user);

    // -----------------------------------------
    // USER COOKIE
    // -----------------------------------------

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    res.status(201).json({
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });

  } catch (error) {
    console.error(
      "User registration error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================================================
// USER - LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------------------
    // FIND USER
    // -----------------------------------------

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------
    // CHECK PASSWORD
    // -----------------------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------
    // CREATE USER TOKEN
    // -----------------------------------------

    const token =
      generateUserToken(user);

    // -----------------------------------------
    // USER COOKIE
    // -----------------------------------------

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });

  } catch (error) {
    console.error(
      "User login error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================================================
// ADMIN - LOGIN
// POST /api/auth/admin/login
// =====================================================
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("================================");
    // console.log("ADMIN LOGIN");
    // console.log("EMAIL:", email);

    // console.log("DATABASE NAME:", Admin.db.name);
    // console.log("COLLECTION NAME:", Admin.collection.name);

    const admin = await Admin.findOne({ email });

    // console.log("ADMIN FOUND:", admin);

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    // console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong admin password",
      });
    }

    const token = generateAdminToken(admin);

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================================
// USER - LOGOUT
// POST /api/auth/logout
// =====================================================

router.post(
  "/logout",
  (req, res) => {
    res.clearCookie(
      "userToken",
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
    );

    res.status(200).json({
      message:
        "User logged out successfully",
    });
  }
);


// =====================================================
// ADMIN - LOGOUT
// POST /api/auth/admin/logout
// =====================================================

router.post(
  "/admin/logout",
  (req, res) => {
    res.clearCookie(
      "adminToken",
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
    );

    res.status(200).json({
      message:
        "Admin logged out successfully",
    });
  }
);


module.exports = router;