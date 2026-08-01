import { Mail, Phone, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-logo">
         <NavLink to="/"><img src={logo} alt="Logo" className="logo" /></NavLink>
      </div>

      <div className="info">
        <div className="info-item">
          <MapPin />
          <span>Kolkata, India</span>
        </div>

        <div className="info-item">
          <Mail />
          <span>support@fashionhub.com</span>
        </div>

        <div className="info-item">
          <Phone />
          <span>+91 9876543210</span>
        </div>
      </div>

      <div className="subscribe">
        <h3>Join With Us</h3>

        <div className="subscribe-box">
          <input
            type="email"
            placeholder="Enter your email"
          />
          <button>Send</button>
        </div>
      </div>

    </footer>
  );
}