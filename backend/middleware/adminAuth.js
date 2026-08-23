const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    // ==========================================
    // CHECK COOKIE
    // ==========================================

    let token = req.cookies?.adminToken;

    // ==========================================
    // CHECK AUTHORIZATION HEADER
    // ==========================================

    if (
      !token &&
      req.headers.authorization?.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    // ==========================================
    // NO TOKEN
    // ==========================================

    if (!token) {
      return res.status(401).json({
        message:
          "Admin authentication required",
      });
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_ADMIN_SECRET
    );

    // ==========================================
    // CHECK ROLE
    // ==========================================

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    // ==========================================
    // STORE ADMIN
    // ==========================================

    req.admin = {
      ...decoded,
      id: decoded.id || decoded._id,
    };

    next();
  } catch (error) {
    console.error(
      "ADMIN AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired admin token",
    });
  }
};

module.exports = adminAuth;