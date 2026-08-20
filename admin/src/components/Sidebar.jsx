import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

// import "./Sidebar.css";

const Sidebar = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();

      // After logout, go to admin login
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="sidebar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="sidebar-logo">
        <span>WEAR</span>
        <span>ABLE</span>
      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

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


      {/* =================================================
          LOGOUT
      ================================================= */}

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