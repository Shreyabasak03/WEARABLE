const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_USER_SECRET
    );

    if (decoded.role !== "user") {
      return res.status(403).json({
        message: "User access only",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired user token",
    });
  }
};

module.exports = userAuth;