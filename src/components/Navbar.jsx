import React from "react";
import { MapPin , ChevronDown} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./NavBar.css";
import logo from "../assets/logo.jpeg";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export const Navbar = () => {
  // Temporary value
  const cartCount = 3;
  const location = false
  return (
    <nav className="navbar">
      <div className="logo1">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="image1" />
        </NavLink>

         <div class="loc">
        <MapPin />
        <span >{location ? <div></div> : "Add location "}</span>
            <ChevronDown />
      </div>
      </div>
     

      <div className="product">
        <NavLink to="/men">Men</NavLink>
        <NavLink to="/women">Women</NavLink>
        <NavLink to="/children">Children</NavLink>

        <NavLink to="/cart" className="cart-link">
          <ShoppingCart size={22} />
          <span>Cart</span>

          {cartCount > 0 && (
            <div className="cart-count">{cartCount}</div>
          )}
        </NavLink>
          <header>
        <Show when="signed-out">
          <SignInButton className="signIn"/>
          {/* <SignUpButton className="signOut"/> */}
        </Show>
        <Show when="signed-in">
          <UserButton/>
        </Show>
      </header>
      </div>
    </nav>
  );
};