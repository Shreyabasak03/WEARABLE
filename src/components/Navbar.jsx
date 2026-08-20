import React, { useState } from "react";
import {
  MapPin,
  ChevronDown,
  Navigation,
  Search,
  X,
  ShoppingCart,
  Menu,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import "./NavBar.css";
import logo2 from "../assets/logo.png";

import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/react";

import { useCart } from "../context/cartContext.jsx";

export const Navbar = ({
  location,
  setLocation,
  detectLocation,
  onToggleSidebar,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // GET CART FROM CONTEXT
  const { cartItems } = useCart();

  // CALCULATE TOTAL CART QUANTITY
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  // SEARCH SUBMIT HANDLER
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigates to a search page or passes query param
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // LOCATION DROPDOWN
  const toggleDropDown = () => {
    setOpenDropdown((prev) => !prev);
    if (showLocationForm) {
      setShowLocationForm(false);
    }
  };

  // SAVE MANUAL LOCATION
  const handleSaveLocation = () => {
    const value = manualLocation.trim();
    if (!value) {
      alert("Please enter a location");
      return;
    }

    const newLocation = {
      county: value,
      state: "",
      manual: true,
    };

    setLocation(newLocation);
    localStorage.setItem("userLocation", JSON.stringify(newLocation));

    setManualLocation("");
    setShowLocationForm(false);
    setOpenDropdown(false);
  };

  // USE CURRENT LOCATION
  const handleUseCurrentLocation = () => {
    if (typeof detectLocation !== "function") {
      console.error("detectLocation is not available");
      return;
    }

    localStorage.removeItem("userLocation");
    detectLocation();

    setShowLocationForm(false);
    setOpenDropdown(false);
  };

  return (
    <nav className="navbar">
      {/* LEFT SIDE */}
      <div className="logo1">
        {/* Sidebar button */}
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <NavLink to="/">
          <img src={logo2} alt="Logo" className="image1" />
        </NavLink>

        {/* LOCATION */}
        <div className="location-wrapper">
          <div className="loc" onClick={toggleDropDown}>
            <MapPin size={20} />
            <div className="location-text">
              {location ? (
                <>
                  <p>
                    {location.county ||
                      location.city ||
                      location.town ||
                      location.village ||
                      "Unknown"}
                  </p>
                  {location.state && <p>{location.state}</p>}
                </>
              ) : (
                <p>Detecting location...</p>
              )}
            </div>
            <ChevronDown
              size={18}
              className={openDropdown ? "arrow rotate" : "arrow"}
            />
          </div>

          {/* LOCATION DROPDOWN */}
          {openDropdown && (
            <div className="location-dropdown">
              {!showLocationForm ? (
                <>
                  <div className="dropdown-title">
                    <Navigation size={18} />
                    <span>Location</span>
                  </div>
                  <p className="dropdown-current">Your current location</p>
                  <div className="current-location">
                    <MapPin size={18} />
                    <div>
                      <strong>
                        {location?.county ||
                          location?.city ||
                          location?.town ||
                          location?.village ||
                          "Unknown location"}
                      </strong>
                      <span>{location?.state || ""}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="current-location-btn"
                    onClick={handleUseCurrentLocation}
                  >
                    <Navigation size={18} />
                    Use Current Location
                  </button>

                  <button
                    type="button"
                    className="change-location-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLocationForm(true);
                    }}
                  >
                    Change Location
                  </button>
                </>
              ) : (
                <div className="location-form">
                  <div className="form-header">
                    <h3>Change Location</h3>
                    <button
                      type="button"
                      className="close-btn"
                      onClick={() => setShowLocationForm(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <label>Enter your location</label>
                  <div className="location-input">
                    <Search size={18} />
                    <input
                      type="text"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      placeholder="Enter city or area"
                    />
                  </div>

                  <button
                    type="button"
                    className="save-location-btn"
                    onClick={handleSaveLocation}
                  >
                    Save Location
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className="navbar-search-container">
        <form className="navbar-search-bar" onSubmit={handleSearchSubmit}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search clothes, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="product">
        {/* CART */}
        <NavLink to="/cart" className="cart-link">
          <ShoppingCart size={22} />
          <span>Cart</span>
          {cartCount > 0 && <div className="cart-count">{cartCount}</div>}
        </NavLink>

        {/* CLERK AUTH */}
        {/* <div className="auth">
          <Show when="signed-out">
            <SignInButton>
              <button className="signIn">Sign In</button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div> */}
      </div>
    </nav>
  );
};