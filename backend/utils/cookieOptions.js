const isProduction =
  process.env.NODE_ENV === "production";

const authCookieOptions = {
  httpOnly: true,

  secure: isProduction,

  sameSite: isProduction
    ? "none"
    : "lax",

  maxAge: 7 * 24 * 60 * 60 * 1000,

  path: "/",
};

const adminCookieOptions = {
  httpOnly: true,

  secure: isProduction,

  sameSite: isProduction
    ? "none"
    : "lax",

  maxAge: 24 * 60 * 60 * 1000,

  path: "/",
};

module.exports = {
  authCookieOptions,
  adminCookieOptions,
};