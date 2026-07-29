// import React from "react";
// import {
//   MapPin,
//   ChevronDown,
//   ShoppingCart,
// } from "lucide-react";

// import { NavLink } from "react-router-dom";
// import "./NavBar.css";
// import logo from "../assets/logo.jpeg";

// import {
//   Show,
//   SignInButton,
//   UserButton,
// } from "@clerk/react";

// export const Navbar = ({ location }) => {
//   // Later replace this with your CartContext count
//   const cartCount = 3;

//   return (
//     <nav className="navbar">

//       {/* =========================
//           LOGO + LOCATION
//       ========================= */}
//       <div className="logo1">

//         <NavLink to="/">
//           <img
//             src={logo}
//             alt="Logo"
//             className="image1"
//           />
//         </NavLink>

//         {/* Location */}
//         <div className="loc">

//           <MapPin size={20} />

//           <div className="location-text">

//             {location ? (
//               <>
//                 <p>
//                   {location.county ||
//                     location.city ||
//                     location.town ||
//                     location.village ||
//                     "Unknown"}
//                 </p>

//                 {location.state && (
//                   <p>{location.state}</p>
//                 )}
//               </>
//             ) : (
//               <p>Add location</p>
//             )}

//           </div>

//           <ChevronDown size={18} />

//         </div>

//       </div>


//       {/* =========================
//           NAVIGATION
//       ========================= */}
//       <div className="product">

//         <NavLink to="/men">
//           Men
//         </NavLink>

//         <NavLink to="/women">
//           Women
//         </NavLink>

//         <NavLink to="/children">
//           Children
//         </NavLink>


//         {/* =========================
//             CART
//         ========================= */}
//         <NavLink
//           to="/cart"
//           className="cart-link"
//         >

//           <ShoppingCart size={22} />

//           <span>Cart</span>

//           {cartCount > 0 && (
//             <div className="cart-count">
//               {cartCount}
//             </div>
//           )}

//         </NavLink>


//         {/* =========================
//             CLERK AUTHENTICATION
//         ========================= */}
//         <div className="auth">

//           {/* User is NOT logged in */}
//           <Show when="signed-out">

//             <SignInButton>
//               <button className="signIn">
//                 Sign In
//               </button>
//             </SignInButton>

//           </Show>


//           {/* User IS logged in */}
//           <Show when="signed-in">

//             <UserButton />

//           </Show>

//         </div>

//       </div>

//     </nav>
//   );
// };

// src/components/Navbar.jsx
import React from "react";
import { MapPin, ChevronDown, ShoppingCart, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import logo from "../assets/logo.jpeg";
import { Show, SignInButton, UserButton } from "@clerk/react";

// IMPORTANT: Destructure onToggleSidebar here!
export const Navbar = ({ location, onToggleSidebar }) => {
  const cartCount = 3;

  return (
    <nav className="navbar">
      <div className="logo1">
        {/* CLICK HANDLER MUST BE ATTACHED HERE */}
        <button 
          type="button" 
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        <NavLink to="/">
          <img src={logo} alt="Logo" className="image1" />
        </NavLink>

        <div className="loc">
          <MapPin size={20} />
          <div className="location-text">
            {location ? (
              <>
                <p>{location.county || location.city || location.town || "Unknown"}</p>
                {location.state && <p>{location.state}</p>}
              </>
            ) : (
              <p>Add location</p>
            )}
          </div>
          <ChevronDown size={18} />
        </div>
      </div>

      <div className="product">
        <NavLink to="/cart" className="cart-link">
          <ShoppingCart size={22} />
          <span>Cart</span>
          {cartCount > 0 && <div className="cart-count">{cartCount}</div>}
        </NavLink>

        <div className="auth">
          <Show when="signed-out">
            <SignInButton>
              <button className="signIn">Sign In</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
};