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
// COOKIE OPTIONS
// =====================================================

const getCookieOptions = (maxAge) => ({
  httpOnly: true,

  // HTTPS on Vercel
  secure: process.env.NODE_ENV === "production",

  // Required when frontend and backend are on
  // different Vercel domains
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",

  maxAge,
});

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
    console.error("USER ME ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================================
// ADMIN - CHECK AUTHENTICATION
// GET /api/auth/admin/me
// =====================================================

router.get(
  "/admin/me",
  adminAuth,
  async (req, res) => {
    try {
      const admin = await Admin.findById(
        req.admin.id
      ).select("-password");

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
      console.error("ADMIN ME ERROR:", error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// =====================================================
// USER - REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // -----------------------------------------
    // VALIDATE
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
      email: email.toLowerCase().trim(),
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
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
    });

    // -----------------------------------------
    // CREATE TOKEN
    // -----------------------------------------

    const token = generateUserToken(user);

    // -----------------------------------------
    // USER COOKIE
    // -----------------------------------------

    res.cookie(
      "userToken",
      token,
      getCookieOptions(
        7 * 24 * 60 * 60 * 1000
      )
    );

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
      "USER REGISTRATION ERROR:",
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
    // VALIDATE
    // -----------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // -----------------------------------------
    // FIND USER
    // -----------------------------------------

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
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

    const isMatch = await bcrypt.compare(
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

    const token = generateUserToken(user);

    // -----------------------------------------
    // USER COOKIE
    // -----------------------------------------

    res.cookie(
      "userToken",
      token,
      getCookieOptions(
        7 * 24 * 60 * 60 * 1000
      )
    );

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
    console.error("USER LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================================
// ADMIN - LOGIN
// POST /api/auth/admin/login
// =====================================================

router.post(
  "/admin/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // -----------------------------------------
      // VALIDATE
      // -----------------------------------------

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email and password are required",
        });
      }

      // -----------------------------------------
      // FIND ADMIN
      // -----------------------------------------

      const admin = await Admin.findOne({
        email: email.toLowerCase().trim(),
      });

      if (!admin) {
        return res.status(401).json({
          message: "Admin not found",
        });
      }

      // -----------------------------------------
      // CHECK PASSWORD
      // -----------------------------------------

      const isMatch = await bcrypt.compare(
        password,
        admin.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Wrong admin password",
        });
      }

      // -----------------------------------------
      // CREATE ADMIN TOKEN
      // -----------------------------------------

      const token =
        generateAdminToken(admin);

      // -----------------------------------------
      // ADMIN COOKIE
      // -----------------------------------------

      res.cookie(
        "adminToken",
        token,
        getCookieOptions(
          7 * 24 * 60 * 60 * 1000
        )
      );

      // -----------------------------------------
      // RESPONSE
      // -----------------------------------------

      res.status(200).json({
        message:
          "Admin login successful",

        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });
    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// =====================================================
// USER - LOGOUT
// POST /api/auth/logout
// =====================================================

router.post("/logout", (req, res) => {
  res.clearCookie(
    "userToken",
    getCookieOptions(0)
  );

  res.status(200).json({
    message:
      "User logged out successfully",
  });
});

// =====================================================
// ADMIN - LOGOUT
// POST /api/auth/admin/logout
// =====================================================

router.post(
  "/admin/logout",
  (req, res) => {
    res.clearCookie(
      "adminToken",
      getCookieOptions(0)
    );

    res.status(200).json({
      message:
        "Admin logged out successfully",
    });
  }
);

module.exports = router;