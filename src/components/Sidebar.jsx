import React from "react";
import { NavLink } from "react-router-dom";
import { X, Shirt, User, Baby, Home, ShoppingCart, Info, Phone,Clock  } from "lucide-react";
import "./sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop overlay to close sidebar when clicking outside */}
      <div 
        className={`sidebar-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Categories</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" onClick={onClose} className="sidebar-link">
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          <div className="sidebar-divider" />

          {/* MAIN CATEGORIES */}
          <NavLink to="/men" onClick={onClose} className="sidebar-link">
            <User size={20} />
            <span>Men</span>
          </NavLink>

          <NavLink to="/women" onClick={onClose} className="sidebar-link">
            <Shirt size={20} />
            <span>Women</span>
          </NavLink>

          <NavLink to="/kids" onClick={onClose} className="sidebar-link">
            <Baby size={20} />
            <span>Kids</span>
          </NavLink>

          <div className="sidebar-divider" />

          {/* QUICK LINKS */}
          <NavLink to="/cart" onClick={onClose} className="sidebar-link">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </NavLink>

          <NavLink to="/about" onClick={onClose} className="sidebar-link">
            <Info size={20} />
            <span>About Us</span>
          </NavLink>

          <NavLink to="/contact" onClick={onClose} className="sidebar-link">
            <Phone size={20} />
            <span>Contact</span>
          </NavLink>
          <NavLink to="/orders" onClick={onClose} className="sidebar-link">
                <Clock size={20} />
            <span>Order History</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}