// import React, { useState } from "react";

// import { MapPin, ChevronDown, Navigation, Search, X } from "lucide-react";

// import { NavLink } from "react-router-dom";

// import "./NavBar.css";

// import logo from "../assets/logo.jpeg";

// export const Navbar = ({ location, setLocation, detectLocation }) => {
//   const [openDropdown, setOpenDropdown] = useState(false);

//   const [showLocationForm, setShowLocationForm] = useState(false);

//   const [manualLocation, setManualLocation] = useState("");

//   // Open / close location dropdown
//   const toggleDropDown = () => {
//     setOpenDropdown((prev) => !prev);
//   };

//   // Save manually entered location
//   const handleSaveLocation = () => {
//     if (!manualLocation.trim()) {
//       alert("Please enter a location");

//       return;
//     }

//     const newLocation = {
//       county: manualLocation.trim(),

//       state: "",

//       manual: true,
//     };

//     console.log("Saving manual location:", newLocation);

//     // Update React state
//     setLocation(newLocation);

//     // Save to browser
//     localStorage.setItem("userLocation", JSON.stringify(newLocation));

//     // Reset form
//     setManualLocation("");

//     setShowLocationForm(false);

//     setOpenDropdown(false);
//   };

//   // Use current GPS location
//   const handleUseCurrentLocation = () => {
//     console.log("Using current location...");

//     // Call function from App.jsx
//     detectLocation();

//     setShowLocationForm(false);

//     setOpenDropdown(false);
//   };

//   return (
//     <nav className="navbar">
//       {/* LOGO + LOCATION */}

//       <div className="logo1">
//         <NavLink to="/">
//           <img src={logo} alt="Logo" className="image1" />
//         </NavLink>

//         {/* LOCATION */}

//         <div className="location-wrapper">
//           <div className="loc" onClick={toggleDropDown}>
//             <MapPin size={20} />

//             {location ? (
//               <div className="location-text">
//                 <p>
//                   {location.town ||
//                     location.city ||
//                     location.village ||
//                     location.county ||
//                     "Unknown"}
//                 </p>

//                 {location.state && <p>{location.state}</p>}
//               </div>
//             ) : (
//               <p>Detecting location...</p>
//             )}

//             <ChevronDown
//               size={18}
//               className={openDropdown ? "arrow rotate" : "arrow"}
//             />
//           </div>

//           {/* LOCATION DROPDOWN */}

//           {openDropdown && (
//             <div className="location-dropdown">
//               {!showLocationForm ? (
//                 <>
//                   {/* HEADER */}

//                   <div className="dropdown-title">
//                     <Navigation size={18} />

//                     <span>Location</span>
//                   </div>

//                   <p className="dropdown-current">Your current location</p>

//                   {/* CURRENT LOCATION */}

//                   <div className="current-location">
//                     <MapPin size={18} />

//                     <div>
//                       <strong>
//                         {location?.town ||
//                           location?.city ||
//                           location?.village ||
//                           location?.county ||
//                           "Unknown location"}
//                       </strong>

//                       <span>{location?.state || ""}</span>
//                     </div>
//                   </div>

//                   {/* USE CURRENT LOCATION */}

//                   <button
//                     type="button"
//                     className="current-location-btn"
//                     onClick={handleUseCurrentLocation}
//                   >
//                     <Navigation size={18} />
//                     Use Current Location
//                   </button>

//                   {/* MANUAL LOCATION */}

//                   <button
//                     type="button"
//                     className="change-location-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();

//                       setShowLocationForm(true);
//                     }}
//                   >
//                     Change Location
//                   </button>
//                 </>
//               ) : (
//                 /* MANUAL LOCATION FORM */

//                 <div className="location-form">
//                   <div className="form-header">
//                     <h3>Change Location</h3>

//                     <button
//                       type="button"
//                       className="close-btn"
//                       onClick={() => setShowLocationForm(false)}
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>

//                   <label>Enter your location</label>

//                   <div className="location-input">
//                     <Search size={18} />

//                     <input
//                       type="text"
//                       value={manualLocation}
//                       onChange={(e) => setManualLocation(e.target.value)}
//                       placeholder="Enter city or area"
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     className="save-location-btn"
//                     onClick={handleSaveLocation}
//                   >
//                     Save Location
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* NAVIGATION */}

//       <div className="product">
//         <NavLink to="/men">Men</NavLink>

//         <NavLink to="/women">Women</NavLink>

//         <NavLink to="/kids">Kids</NavLink>

//         <NavLink to="/cart">Cart</NavLink>
//       </div>
//     </nav>
//   );
// };

import React from "react";
import {
  MapPin,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import "./NavBar.css";
import logo from "../assets/logo.jpeg";

import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/react";

export const Navbar = ({ location }) => {
  // Later replace this with your CartContext count
  const cartCount = 3;

  return (
    <nav className="navbar">

      {/* =========================
          LOGO + LOCATION
      ========================= */}
      <div className="logo1">

        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            className="image1"
          />
        </NavLink>

        {/* Location */}
        <div className="loc">

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

                {location.state && (
                  <p>{location.state}</p>
                )}
              </>
            ) : (
              <p>Add location</p>
            )}

          </div>

          <ChevronDown size={18} />

        </div>

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}
      <div className="product">

        <NavLink to="/men">
          Men
        </NavLink>

        <NavLink to="/women">
          Women
        </NavLink>

        <NavLink to="/children">
          Children
        </NavLink>


        {/* =========================
            CART
        ========================= */}
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


        {/* =========================
            CLERK AUTHENTICATION
        ========================= */}
        <div className="auth">

          {/* User is NOT logged in */}
          <Show when="signed-out">

            <SignInButton>
              <button className="signIn">
                Sign In
              </button>
            </SignInButton>

          </Show>


          {/* User IS logged in */}
          <Show when="signed-in">

            <UserButton />

          </Show>

        </div>

      </div>

    </nav>
  );
};