import React, { useState } from "react";
import {
  Search,
  X,
  ShoppingCart,
  Menu,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext.jsx";

import "./NavBar.css";
import logo2 from "../assets/logo.png";

export const Navbar = ({
  onToggleSidebar,
}) => {
  const { user, loading, logout } = useAuth();

  const [openAccount, setOpenAccount] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // CART
  // ==========================================

  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 1),
    0
  );

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();

      setOpenAccount(false);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ==========================================
  // ACCOUNT DROPDOWN
  // ==========================================

  const toggleAccount = () => {
    setOpenAccount((prev) => !prev);
  };

  return (
    <nav className="navbar">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="logo1">

        {/* SIDEBAR BUTTON */}

        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>


        {/* LOGO */}

        <NavLink to="/">
          <img
            src={logo2}
            alt="Logo"
            className="image1"
          />
        </NavLink>

      </div>


      {/* =================================================
          CENTER SEARCH
      ================================================= */}

      <div className="navbar-search-container">

        <form
          className="navbar-search-bar"
          onSubmit={handleSearchSubmit}
        >

          <Search
            size={18}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search clothes, brands, or categories..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={handleClearSearch}
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="search-submit-btn"
          >
            Search
          </button>

        </form>

      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="product">

        {/* =================================================
            CART
        ================================================= */}

        <NavLink
          to="/cart"
          className="cart-link"
        >

          <ShoppingCart size={22} />

          <span>Cart</span>

          {cartCount > 0 && (
            <div className="cart-count">
              {cartCount}
            </div>
          )}

        </NavLink>


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="account-wrapper">

          {loading ? (

            <div className="account-loading">
              Checking...
            </div>

          ) : user ? (

            <>

              {/* ACCOUNT BUTTON */}

              <button
                type="button"
                className={`account-button ${
                  openAccount
                    ? "account-button-active"
                    : ""
                }`}
                onClick={toggleAccount}
              >

                <div className="account-avatar">
                  <User size={19} />
                </div>

                <div className="account-info">

                  <span className="account-label">
                    Account
                  </span>

                  <span className="account-name">
                    {user.name || "User"}
                  </span>

                </div>

                <ChevronDown
                  size={17}
                  className={
                    openAccount
                      ? "account-arrow rotate"
                      : "account-arrow"
                  }
                />

              </button>


              {/* ACCOUNT DROPDOWN */}

              {openAccount && (

                <div className="account-dropdown">

                  {/* USER HEADER */}

                  <div className="account-dropdown-header">

                    <div className="account-big-avatar">
                      <User size={24} />
                    </div>

                    <div className="account-user-details">

                      <strong>
                        {user.name || "User"}
                      </strong>

                      <span>
                        {user.email}
                      </span>

                    </div>

                  </div>


                  {/* DIVIDER */}

                  <div className="account-divider" />


                  {/* ACCOUNT STATUS */}

                  <div className="account-status">

                    <div className="status-dot" />

                    <div>
                      <span className="status-title">
                        Signed in
                      </span>

                      <span className="status-email">
                        {user.email}
                      </span>
                    </div>

                  </div>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                  >

                    <LogOut size={18} />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              )}

            </>

          ) : (

            /* =================================================
               NOT LOGGED IN
            ================================================= */

            <button
              type="button"
              className="login-button"
              onClick={() => navigate("/login")}
            >

              <User size={18} />

              <span>
                Login
              </span>

            </button>

          )}

        </div>

      </div>

    </nav>
  );
};