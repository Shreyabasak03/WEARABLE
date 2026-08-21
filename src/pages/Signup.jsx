import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await register(
        name,
        email,
        password
      );

      navigate("/");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 75px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
       background:
                "linear-gradient(135deg, #6fd6cb 0%, #42a89c 40%, #1f7b70 100%)",
      }}
    >

      {/* ==========================================
          SIGNUP CARD
      ========================================== */}

      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "38px",
          boxSizing: "border-box",
          boxShadow:
            "0 20px 50px rgba(29, 95, 84, 0.15)",
          border:
            "1px solid rgba(29, 95, 84, 0.08)",
        }}
      >

        {/* ==========================================
            ICON
        ========================================== */}

        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#e8f7f3",
            color: "#1d5f54",
          }}
        >
          <UserPlus size={30} />
        </div>


        {/* ==========================================
            TITLE
        ========================================== */}

        <h2
          style={{
            margin: "0",
            textAlign: "center",
            color: "#1d5f54",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          Create Account
        </h2>

        <p
          style={{
            margin: "8px 0 30px",
            textAlign: "center",
            color: "#71817d",
            fontSize: "14px",
          }}
        >
          Create an account to start shopping
        </p>


        {/* ==========================================
            FORM
        ========================================== */}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div style={{ marginBottom: "18px" }}>

            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#344e49",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Full Name
            </label>

            <div
              style={{
                height: "48px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d5e5e1",
                borderRadius: "10px",
                background: "#ffffff",
              }}
            >

              <User
                size={18}
                color="#1d5f54"
              />

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                disabled={loading}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#333",
                  fontSize: "14px",
                }}
              />

            </div>

          </div>


          {/* EMAIL */}

          <div style={{ marginBottom: "18px" }}>

            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#344e49",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Email Address
            </label>

            <div
              style={{
                height: "48px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d5e5e1",
                borderRadius: "10px",
                background: "#ffffff",
              }}
            >

              <Mail
                size={18}
                color="#1d5f54"
              />

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
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#333",
                  fontSize: "14px",
                }}
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div style={{ marginBottom: "20px" }}>

            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#344e49",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Password
            </label>

            <div
              style={{
                height: "48px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d5e5e1",
                borderRadius: "10px",
                background: "#ffffff",
              }}
            >

              <Lock
                size={18}
                color="#1d5f54"
              />

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#333",
                  fontSize: "14px",
                }}
              />

            </div>

            <p
              style={{
                margin: "6px 0 0",
                color: "#8a9995",
                fontSize: "12px",
              }}
            >
              Password must be at least 6 characters.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div
              style={{
                padding: "11px 13px",
                marginBottom: "18px",
                borderRadius: "9px",
                background: "#fff2f2",
                border:
                  "1px solid #f3cccc",
                color: "#c53030",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #2aae9b, #1d5f54)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow:
                "0 6px 16px rgba(29, 95, 84, 0.2)",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* ==========================================
            LOGIN LINK
        ========================================== */}

        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop:
              "1px solid #e5eeeb",
            textAlign: "center",
            color: "#71817d",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            style={{
              color: "#1d5f54",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;