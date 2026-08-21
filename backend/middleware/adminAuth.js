const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    // 1. Check cookie or Bearer header
    let token = req.cookies?.adminToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ADMIN_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    // Support both decoded.id and decoded._id
    req.admin = {
      ...decoded,
      id: decoded.id || decoded._id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};

module.exports = adminAuth;