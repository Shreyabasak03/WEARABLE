import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";

import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Your full WhatsApp number with country code (no '+' or spaces)
  const WHATSAPP_NUMBER = "918945926317"; // Replace with your actual number

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      alert("Please enter your name and message.");
      return;
    }

    const textMessage = 
      `*New Inquiry from Wearable Store*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email || "Not provided"}\n` +
      `*Subject:* ${formData.subject || "General Inquiry"}\n\n` +
      `*Message:*\n${formData.message}`;

    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

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
              <p>+91 8945926317</p>
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

          <form onSubmit={handleWhatsAppSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">
              <Send size={18} />
              Send Message via WhatsApp
            </button>
          </form>
        </div>

      </section>

    </div>
  );
}