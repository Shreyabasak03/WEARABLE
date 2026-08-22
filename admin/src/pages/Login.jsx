import React, { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import logo2 from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LOGO / BRAND */}
      <div
  className="sidebar-logo"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    width: "100%",
    height: "auto",
    padding: 0,
    margin: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    lineHeight: 0,
  }}
>
  <NavLink
    to="/"
    style={{
      display: "flex",
        alignItems: "center",
    justifyContent: "center",
      width: "100%",
      height: "auto",
      padding: 0,
      margin: 0,
      textDecoration: "none",
      outline: "none",
      lineHeight: 0,
    }}
  >
    <img
      src={logo2}
      alt="Logo"
      className="image1"
      style={{
        display: "block",
        width: "auto",
        height: "auto",
        maxHeight: "160px",
        maxWidth: "100%",
        objectFit: "contain",
        padding: 0,
        margin: 0,
        lineHeight: 0,
      }}
    />
  </NavLink>
</div>
        {/* HEADER */}
        <div className="login-header">
          <h2>Welcome Back</h2>

          <p>
            Sign in to access your admin dashboard.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter admin email"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="login-error">
              <span className="error-icon">!</span>

              <span>{error}</span>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          <span>Secure administrator access</span>
        </div>

      </div>
    </div>
  );
};

export default Login;