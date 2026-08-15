import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <span>WEAR</span>
        <span>ABLE</span>
      </div>

      <nav className="sidebar-nav">

        <a href="#" className="sidebar-link active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>

        <a href="#" className="sidebar-link">
          <Package size={20} />
          <span>Products</span>
        </a>

        <a href="#" className="sidebar-link">
          <ShoppingCart size={20} />
          <span>Orders</span>
        </a>

        <a href="#" className="sidebar-link">
          <Users size={20} />
          <span>Users</span>
        </a>

        <a href="#" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </a>

      </nav>

      <button className="logout-button">
        <LogOut size={20} />
        <span>Logout</span>
      </button>

    </aside>
  );
};

export default Sidebar;