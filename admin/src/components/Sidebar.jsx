import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo2 from "../assets/logo.png";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();

      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="sidebar">

      {/* ===============================
          LOGO
      =============================== */}

     <div
  className="sidebar-logo"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "clamp(10px, 2vw, 20px)",
    minWidth: 0,
    width: "100%",
  
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
  <NavLink
    to="/admin/dashboard"
    style={{
      display: "inline-flex",
      alignItems: "center",
      textDecoration: "none",
      outline: "none",
    }}
  >
    <img
      src={logo2}
      alt="Logo"
      className="image1"
      style={{
        height: "auto",
        maxHeight: "160px",
        maxWidth: "100%",
        objectFit: "contain",
        display: "block",
      }}
    />
  </NavLink>
</div>


      {/* ===============================
          NAVIGATION
      =============================== */}

      <nav className="sidebar-nav">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Package size={20} />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Users size={20} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* ===============================
          LOGOUT
      =============================== */}

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        <LogOut size={20} />

        <span>
          Logout
        </span>
      </button>

    </aside>
  );
};

export default Sidebar;