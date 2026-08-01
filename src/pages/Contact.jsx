import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";

import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-overlay">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you. Get in touch with our team anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-container">

        {/* Contact Info */}
        <div className="contact-info">

          <h2>Get In Touch</h2>

          <p>
            Have questions about your order or need help with shopping?
            Our support team is here to help.
          </p>

          <div className="info-box">
            <MapPin size={22} />
            <div>
              <h4>Address</h4>
              <p>Kolkata, West Bengal, India</p>
            </div>
          </div>

          <div className="info-box">
            <Phone size={22} />
            <div>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="info-box">
            <Mail size={22} />
            <div>
              <h4>Email</h4>
              <p>support@wearable.com</p>
            </div>
          </div>

          <div className="info-box">
            <Clock size={22} />
            <div>
              <h4>Working Hours</h4>
              <p>Monday - Saturday</p>
              <p>9:00 AM - 8:00 PM</p>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="contact-form">

          <h2>Send a Message</h2>

          <form>

            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              rows="6"
              placeholder="Write your message..."
            ></textarea>

            <button type="submit">
              <Send size={18} />
              Send Message
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}