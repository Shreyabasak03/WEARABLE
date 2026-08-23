const jwt = require("jsonwebtoken");

// ==========================================
// USER TOKEN
// ==========================================

const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: "user",
    },
    process.env.JWT_USER_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// ADMIN TOKEN
// ==========================================

const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: "admin",
    },
    process.env.JWT_ADMIN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateUserToken,
  generateAdminToken,
};