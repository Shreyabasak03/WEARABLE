import React from "react";
import { NavLink } from "react-router-dom";

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

        {/* Dashboard */}

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <LayoutDashboard size={20} />

          <span>
            Dashboard
          </span>
        </NavLink>


        {/* Products */}

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <Package size={20} />

          <span>
            Products
          </span>
        </NavLink>


        {/* Orders */}

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <ShoppingCart size={20} />

          <span>
            Orders
          </span>
        </NavLink>


        {/* Users */}

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <Users size={20} />

          <span>
            Users
          </span>
        </NavLink>


        {/* Settings */}

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <Settings size={20} />

          <span>
            Settings
          </span>
        </NavLink>

      </nav>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <button
        type="button"
        className="logout-button"
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