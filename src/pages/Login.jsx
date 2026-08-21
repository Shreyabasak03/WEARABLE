import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px 20px",
        boxSizing: "border-box",

        background:
          "linear-gradient(135deg, #e8f7f3 0%, #d5f0ea 45%, #b9e3dc 100%)",
      }}
    >
      {/* LOGIN CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",

          background: "#ffffff",

          padding: "42px",

          borderRadius: "18px",

          boxSizing: "border-box",

          boxShadow:
            "0 20px 50px rgba(29, 95, 84, 0.15)",

          border:
            "1px solid rgba(29, 95, 84, 0.08)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          {/* Logo / Icon */}
          <div
            style={{
              width: "58px",
              height: "58px",
              margin: "0 auto 16px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "16px",

              background:
                "linear-gradient(135deg, #6fd6cb 0%, #42a89c 40%, #1f7b70 100%)",

              color: "#ffffff",

              fontSize: "25px",
              fontWeight: "700",

              boxShadow:
                "0 8px 20px rgba(31, 123, 112, 0.2)",
            }}
          >
            W
          </div>

          <h2
            style={{
              margin: "0 0 8px",

              fontSize: "29px",

              fontWeight: "700",

              color: "#1D5F54",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              margin: 0,

              fontSize: "14px",

              color: "#71817d",
            }}
          >
            Login to your Wearable account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",

                marginBottom: "8px",

                fontSize: "14px",

                fontWeight: "600",

                color: "#2C3E50",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              style={{
                width: "100%",

                padding: "13px 14px",

                border:
                  "1px solid #d5e5e1",

                borderRadius: "9px",

                fontSize: "14px",

                outline: "none",

                boxSizing: "border-box",

                background: "#f9fcfb",

                color: "#2C3E50",

                transition: "0.2s",
              }}
            />
          </div>

          {/* PASSWORD */}
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",

                marginBottom: "8px",

                fontSize: "14px",

                fontWeight: "600",

                color: "#2C3E50",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              style={{
                width: "100%",

                padding: "13px 14px",

                border:
                  "1px solid #d5e5e1",

                borderRadius: "9px",

                fontSize: "14px",

                outline: "none",

                boxSizing: "border-box",

                background: "#f9fcfb",

                color: "#2C3E50",

                transition: "0.2s",
              }}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",

              padding: "13px",

              border: "none",

              borderRadius: "9px",

              background:
                "linear-gradient(135deg, #2AAE9B 0%, #1D5F54 100%)",

              color: "#ffffff",

              fontSize: "15px",

              fontWeight: "600",

              cursor: loading
                ? "not-allowed"
                : "pointer",

              opacity: loading ? 0.7 : 1,

              boxShadow:
                "0 6px 15px rgba(29, 95, 84, 0.2)",

              transition: "0.2s",
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* SIGNUP LINK */}
        <div
          style={{
            marginTop: "26px",

            paddingTop: "20px",

            borderTop:
              "1px solid #e5eeeb",

            textAlign: "center",

            color: "#71817d",

            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/signup"
            style={{
              color: "#1D5F54",

              fontWeight: "700",

              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;