import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Opens the user's default mail app to send an email to your support address
    const subject = encodeURIComponent("Newsletter Subscription Request");
    const body = encodeURIComponent(
      `Hi Team,\n\nPlease subscribe my email (${email}) to the Wearable newsletter.`
    );
    window.location.href = `mailto:shreyabasak368@gmail?subject=${subject}&body=${body}`;

    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="logo" />
        </NavLink>
      </div>

      <div className="info">
        <div className="info-item">
          <MapPin />
          <span>Kolkata, India</span>
        </div>

        <div className="info-item">
          <a
            href="mailto:shreyabasak368@gmail.com"
            style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Mail />
            <span>support@wearable.com</span>
          </a>
        </div>

        <div className="info-item">
          <a
            href="tel:+919876543210"
            style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Phone />
            <span>+91 9876543210</span>
          </a>
        </div>
      </div>

      <div className="subscribe">
        <h3>Join With Us</h3>

        <form className="subscribe-box" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </footer>
  );
}