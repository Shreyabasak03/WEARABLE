const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    // ==========================================
    // GET USER TOKEN FROM COOKIE
    // ==========================================

    const token = req.cookies?.userToken;

    // ==========================================
    // TOKEN NOT FOUND
    // ==========================================

    if (!token) {
      return res.status(401).json({
        message:
          "User authentication required",
      });
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_USER_SECRET
    );

    // ==========================================
    // CHECK ROLE
    // ==========================================

    if (decoded.role !== "user") {
      return res.status(403).json({
        message: "User access only",
      });
    }

    // ==========================================
    // STORE USER
    // ==========================================

    req.user = {
      ...decoded,
      id: decoded.id || decoded._id,
    };

    next();
  } catch (error) {
    console.error(
      "USER AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired user token",
    });
  }
};

module.exports = userAuth;