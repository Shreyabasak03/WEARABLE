// import React, { useState } from "react";
// import { MapPin, ChevronDown, Navigation } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import "./NavBar.css";
// import logo from "../assets/logo.jpeg";

// export const Navbar = ({ location }) => {
//   const [openDropdown, setOpenDropdown] = useState(false);

//   const toggleDropDown = () => {
//     setOpenDropdown((prev) => !prev);
//   };

//   return (
//     <nav className="navbar">

//       <div className="logo1">

//         <NavLink to="/">
//           <img
//             src={logo}
//             alt="Logo"
//             className="image1"
//           />
//         </NavLink>

//         {/* Location */}
//         <div className="location-wrapper">

//           <div className="loc" onClick={toggleDropDown}>
//             <MapPin size={20} />

//             {location ? (
//               <div className="location-text">
//                 <p>{location.county}</p>
//                 <p>{location.state}</p>
//               </div>
//             ) : (
//               <p>Detecting location...</p>
//             )}

//             <ChevronDown
//               size={18}
//               className={openDropdown ? "arrow rotate" : "arrow"}
//             />
//           </div>

//           {/* Dropdown */}
//           {openDropdown && (
//             <div className="location-dropdown">

//               <div className="dropdown-title">
//                 <Navigation size={18} />
//                 <span>Change Location</span>
//               </div>

//               <p className="dropdown-current">
//                 Current location
//               </p>

//               <div className="current-location">
//                 <MapPin size={18} />

//                 <div>
//                   <strong>
//                     {location?.county || "Unknown location"}
//                   </strong>

//                   <span>
//                     {location?.state || ""}
//                   </span>
//                 </div>
//               </div>

//               <button className="change-location-btn">
//                 Change Location
//               </button>

//             </div>
//           )}

//         </div>

//       </div>

//       <div className="product">
//         <NavLink to="/men">Men</NavLink>
//         <NavLink to="/women">Women</NavLink>
//         <NavLink to="/children">Children</NavLink>
//         <NavLink to="/cart">Cart</NavLink>
//       </div>

//     </nav>
//   );
// };

import React, { useState } from "react";
import {
  MapPin,
  ChevronDown,
  Navigation,
  Search,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import logo from "../assets/logo.jpeg";

export const Navbar = ({ location, setLocation }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [manualLocation, setManualLocation] = useState("");

  const toggleDropDown = () => {
    setOpenDropdown((prev) => !prev);
  };

  const handleSaveLocation = () => {
  if (!manualLocation.trim()) {
    alert("Please enter a location");
    return;
  }

  const newLocation = {
    county: manualLocation,
    state: "",
    manual: true,
  };

  console.log("Saving location:", newLocation);

  setLocation(newLocation);

  setManualLocation("");
  setShowLocationForm(false);
  setOpenDropdown(false);
};

  return (
    <nav className="navbar">

      <div className="logo1">

        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            className="image1"
          />
        </NavLink>

        <div className="location-wrapper">

          <div
            className="loc"
            onClick={toggleDropDown}
          >
            <MapPin size={20} />

            {location ? (
              <div className="location-text">
                <p>
                  {location.county ||
                    location.city ||
                    location.town}
                </p>

                {location.state && (
                  <p>{location.state}</p>
                )}
              </div>
            ) : (
              <p>Detecting location...</p>
            )}

            <ChevronDown
              size={18}
              className={
                openDropdown
                  ? "arrow rotate"
                  : "arrow"
              }
            />
          </div>

          {openDropdown && (
            <div className="location-dropdown">

              {!showLocationForm ? (
                <>
                  <div className="dropdown-title">
                    <Navigation size={18} />
                    <span>Location</span>
                  </div>

                  <p className="dropdown-current">
                    Your current location
                  </p>

                  <div className="current-location">
                    <MapPin size={18} />

                    <div>
                      <strong>
                        {location?.county ||
                          "Unknown location"}
                      </strong>

                      <span>
                        {location?.state || ""}
                      </span>
                    </div>
                  </div>

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
                      onClick={() =>
                        setShowLocationForm(false)
                      }
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <label>
                    Enter your location
                  </label>

                  <div className="location-input">
                    <Search size={18} />

                    <input
                      type="text"
                      value={manualLocation}
                      onChange={(e) =>
                        setManualLocation(e.target.value)
                      }
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

      <div className="product">
        <NavLink to="/men">Men</NavLink>
        <NavLink to="/women">Women</NavLink>
        <NavLink to="/children">Children</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </div>

    </nav>
  );
};