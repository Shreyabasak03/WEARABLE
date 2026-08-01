import React from "react";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  Star,
} from "lucide-react";

import "./About.css";

export default function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">

        <div className="about-overlay">

          <h1>About Wearable</h1>

          <p>
            Discover premium fashion for Men, Women, and Accessories
            with quality you can trust.
          </p>

        </div>

      </section>

      {/* About */}
      <section className="about-section">

        <div className="about-image">

          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900"
            alt="Fashion"
          />

        </div>

        <div className="about-content">

          <h2>Who We Are</h2>

          <p>
            Wearable is an online fashion destination created to make
            shopping simple, enjoyable, and affordable. We offer a wide
            collection of clothing, footwear, watches, bags, and fashion
            accessories for every style.
          </p>

          <p>
            Our mission is to deliver high-quality products with a smooth
            shopping experience, secure payments, and fast delivery.
          </p>

        </div>

      </section>

      {/* Features */}

      <section className="features-section">

        <h2>Why Choose Us?</h2>

        <div className="features-grid">

          <div className="feature-card">
            <ShoppingBag size={40} />
            <h3>Latest Fashion</h3>
            <p>
              Explore thousands of trendy products updated regularly.
            </p>
          </div>

          <div className="feature-card">
            <Truck size={40} />
            <h3>Fast Delivery</h3>
            <p>
              Quick and reliable shipping across the country.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck size={40} />
            <h3>Secure Payment</h3>
            <p>
              Safe and secure checkout with trusted payment methods.
            </p>
          </div>

          <div className="feature-card">
            <Headphones size={40} />
            <h3>24/7 Support</h3>
            <p>
              Friendly customer support whenever you need help.
            </p>
          </div>

        </div>

      </section>

      {/* Stats */}

      <section className="stats-section">

        <div className="stat-box">
          <h2>15K+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-box">
          <h2>800+</h2>
          <p>Fashion Products</p>
        </div>

        <div className="stat-box">
          <h2>98%</h2>
          <p>Customer Satisfaction</p>
        </div>

        <div className="stat-box">
          <h2>4.9</h2>

          <div className="rating">
            <Star fill="gold" />
            <Star fill="gold" />
            <Star fill="gold" />
            <Star fill="gold" />
            <Star fill="gold" />
          </div>

          <p>Average Rating</p>

        </div>

      </section>

    </div>
  );
}