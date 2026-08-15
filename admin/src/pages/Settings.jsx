import React, { useState } from "react";
import {
  Store,
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
} from "lucide-react";

import "./Settings.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("store");

  const [storeName, setStoreName] = useState("Wearable");
  const [email, setEmail] = useState("admin@wearable.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [currency, setCurrency] = useState("INR");

  const sections = [
    {
      id: "store",
      label: "Store Settings",
      icon: Store,
    },
    {
      id: "profile",
      label: "Admin Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
    },
  ];

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your store and admin preferences.
          </p>
        </div>
      </div>


      {/* =================================================
          SETTINGS LAYOUT
      ================================================= */}

      <div className="settings-layout">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <div className="settings-sidebar">

          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                className={`settings-nav-item ${
                  activeSection === section.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(section.id)
                }
              >
                <Icon size={17} />

                <span>
                  {section.label}
                </span>
              </button>
            );
          })}

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="settings-content">


          {/* =================================================
              STORE SETTINGS
          ================================================= */}

          {activeSection === "store" && (
            <div className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Store Settings</h2>

                  <p>
                    Configure basic information about your
                    ecommerce store.
                  </p>
                </div>
              </div>


              <div className="settings-form">


                <div className="form-group">

                  <label>
                    Store Name
                  </label>

                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) =>
                      setStoreName(e.target.value)
                    }
                  />

                </div>


                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Store Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="text"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Currency
                  </label>

                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value)
                    }
                  >
                    <option value="INR">
                      INR — Indian Rupee
                    </option>

                    <option value="USD">
                      USD — US Dollar
                    </option>

                    <option value="EUR">
                      EUR — Euro
                    </option>
                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Store Description
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Enter your store description..."
                    defaultValue="Wearable is an online fashion store offering modern clothing and accessories."
                  />

                </div>


              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={handleSave}
                >
                  <Save size={16} />

                  Save Changes
                </button>

              </div>

            </div>
          )}


          {/* =================================================
              ADMIN PROFILE
          ================================================= */}

          {activeSection === "profile" && (
            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Admin Profile</h2>

                  <p>
                    Manage your administrator account
                    information.
                  </p>
                </div>

              </div>


              <div className="profile-section">

                <div className="large-avatar">
                  A
                </div>

                <div>
                  <h3>
                    Admin
                  </h3>

                  <p>
                    Store Administrator
                  </p>

                  <button className="secondary-button">
                    Change Avatar
                  </button>
                </div>

              </div>


              <div className="settings-form">

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      First Name
                    </label>

                    <input
                      type="text"
                      defaultValue="Admin"
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Last Name
                    </label>

                    <input
                      type="text"
                      defaultValue="User"
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    defaultValue="admin@wearable.com"
                  />

                </div>

              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={handleSave}
                >
                  <Save size={16} />

                  Save Changes
                </button>

              </div>

            </div>
          )}


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeSection === "notifications" && (
            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Notifications</h2>

                  <p>
                    Choose which notifications you want
                    to receive.
                  </p>
                </div>

              </div>


              <div className="notification-list">

                <div className="notification-item">

                  <div>
                    <h3>
                      New Orders
                    </h3>

                    <p>
                      Get notified when a new order is
                      placed.
                    </p>
                  </div>

                  <label className="toggle">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span />
                  </label>

                </div>


                <div className="notification-item">

                  <div>
                    <h3>
                      Low Stock
                    </h3>

                    <p>
                      Receive alerts when products have
                      low inventory.
                    </p>
                  </div>

                  <label className="toggle">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span />
                  </label>

                </div>


                <div className="notification-item">

                  <div>
                    <h3>
                      New Users
                    </h3>

                    <p>
                      Get notified when a new customer
                      registers.
                    </p>
                  </div>

                  <label className="toggle">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span />
                  </label>

                </div>


                <div className="notification-item">

                  <div>
                    <h3>
                      Email Notifications
                    </h3>

                    <p>
                      Receive important store updates
                      through email.
                    </p>
                  </div>

                  <label className="toggle">
                    <input
                      type="checkbox"
                    />
                    <span />
                  </label>

                </div>

              </div>

            </div>
          )}


          {/* =================================================
              SECURITY
          ================================================= */}

          {activeSection === "security" && (
            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Security</h2>

                  <p>
                    Manage your admin account security.
                  </p>
                </div>

              </div>


              <div className="settings-form">

                <div className="form-group">

                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter current password"
                  />

                </div>


                <div className="form-group">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter new password"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm new password"
                  />

                </div>

              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={handleSave}
                >
                  <Save size={16} />

                  Update Password
                </button>

              </div>

            </div>
          )}


          {/* =================================================
              PAYMENTS
          ================================================= */}

          {activeSection === "payments" && (
            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Payment Settings</h2>

                  <p>
                    Configure the payment methods
                    available in your store.
                  </p>
                </div>

              </div>


              <div className="payment-list">


                <div className="payment-item">

                  <div className="payment-info">

                    <div className="payment-icon">
                      <CreditCard size={18} />
                    </div>

                    <div>

                      <h3>
                        Cash on Delivery
                      </h3>

                      <p>
                        Allow customers to pay when
                        their order arrives.
                      </p>

                    </div>

                  </div>


                  <label className="toggle">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span />
                  </label>

                </div>


                <div className="payment-item">

                  <div className="payment-info">

                    <div className="payment-icon">
                      <CreditCard size={18} />
                    </div>

                    <div>

                      <h3>
                        Online Payment
                      </h3>

                      <p>
                        Accept payments through online
                        payment gateways.
                      </p>

                    </div>

                  </div>


                  <label className="toggle">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span />
                  </label>

                </div>


                <div className="payment-item">

                  <div className="payment-info">

                    <div className="payment-icon">
                      <CreditCard size={18} />
                    </div>

                    <div>

                      <h3>
                        UPI
                      </h3>

                      <p>
                        Allow customers to pay using
                        UPI.
                      </p>

                    </div>

                  </div>


                  <label className="toggle">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span />
                  </label>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;