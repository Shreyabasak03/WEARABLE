import React, { useEffect, useRef, useState } from "react";

import {
  Store,
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import axios from "axios";

import { useUser } from "@clerk/react";

import "./Settings.css";

const API_URL = "http://localhost:5001/api/settings";

const Settings = () => {
  // =====================================================
  // CLERK
  // =====================================================

  const { isLoaded, isSignedIn, user } = useUser();

  // =====================================================
  // STATES
  // =====================================================

  const [activeSection, setActiveSection] = useState("store");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // STORE
  // =====================================================

  const [storeName, setStoreName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [currency, setCurrency] = useState("INR");

  const [description, setDescription] = useState("");

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newUsers: true,
    emailNotifications: false,
  });

  // =====================================================
  // PAYMENTS
  // =====================================================

  const [payments, setPayments] = useState({
    cod: true,
    online: true,
    upi: true,
  });

  // =====================================================
  // PROFILE
  // =====================================================

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [profileEmail, setProfileEmail] = useState("");

  // =====================================================
  // PASSWORD
  // =====================================================

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // IMAGE
  // =====================================================

  const fileInputRef = useRef(null);

  // =====================================================
  // SECTIONS
  // =====================================================

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

  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (text) => {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const showError = (text) => {
    setError(text);
    setMessage("");

    setTimeout(() => {
      setError("");
    }, 4000);
  };

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const data = response.data.settings;

      // Store

      setStoreName(data.storeName || "");

      setEmail(data.email || "");

      setPhone(data.phone || "");

      setCurrency(data.currency || "INR");

      setDescription(data.description || "");

      // Notifications

      if (data.notifications) {
        setNotifications({
          newOrders: data.notifications.newOrders ?? true,

          lowStock: data.notifications.lowStock ?? true,

          newUsers: data.notifications.newUsers ?? true,

          emailNotifications: data.notifications.emailNotifications ?? false,
        });
      }

      // Payments

      if (data.payments) {
        setPayments({
          cod: data.payments.cod ?? true,

          online: data.payments.online ?? true,

          upi: data.payments.upi ?? true,
        });
      }
    } catch (err) {
      console.error("SETTINGS FETCH ERROR:", err);

      showError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================================================
  // LOAD CLERK PROFILE
  // =====================================================

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFirstName(user.firstName || "");

      setLastName(user.lastName || "");

      setProfileEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, isSignedIn, user]);

  // =====================================================
  // SAVE STORE
  // =====================================================

  const saveStoreSettings = async () => {
    try {
      setSaving(true);

      await axios.put(`${API_URL}/store`, {
        storeName,
        email,
        phone,
        currency,
        description,
      });

      showMessage("Store settings saved successfully");
    } catch (err) {
      console.error(err);

      showError("Failed to save store settings");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);

      await user.update({
        firstName,
        lastName,
      });

      showMessage("Profile updated successfully");
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      showError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CHANGE PROFILE IMAGE
  // =====================================================

  const handleProfileImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    try {
      setSaving(true);

      await user.setProfileImage({
        file,
      });

      await user.reload();

      showMessage("Profile image updated");
    } catch (err) {
      console.error("IMAGE ERROR:", err);

      showError("Failed to update profile image");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SAVE NOTIFICATIONS
  // =====================================================

  const saveNotifications = async () => {
    try {
      setSaving(true);

      await axios.put(`${API_URL}/notifications`, notifications);

      showMessage("Notification settings saved");
    } catch (err) {
      console.error(err);

      showError("Failed to save notifications");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SAVE PAYMENTS
  // =====================================================

  const savePayments = async () => {
    try {
      setSaving(true);

      await axios.put(`${API_URL}/payments`, payments);

      showMessage("Payment settings saved");
    } catch (err) {
      console.error(err);

      showError("Failed to save payment settings");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  const updatePassword = async () => {
    if (!user) return;

    if (!currentPassword) {
      showError("Enter your current password");

      return;
    }

    if (!newPassword) {
      showError("Enter a new password");

      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");

      return;
    }

    if (newPassword.length < 8) {
      showError("Password must be at least 8 characters");

      return;
    }

    try {
      setSaving(true);

      await user.updatePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showMessage("Password updated successfully");
    } catch (err) {
      console.error("PASSWORD ERROR:", err);

      showError(err?.errors?.[0]?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading || !isLoaded) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <Loader2 size={24} className="spin" />

          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // TOGGLE
  // =====================================================

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePayment = (key) => {
    setPayments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="settings-page">
      {/* HEADER */}

      <div className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>Manage your store and admin preferences.</p>
        </div>
      </div>

      {/* SUCCESS */}

      {message && (
        <div className="settings-message success">
          <CheckCircle size={17} />

          {message}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="settings-message error">
          <AlertCircle size={17} />

          {error}
        </div>
      )}

      <div className="settings-layout">
        {/* SIDEBAR */}

        <div className="settings-sidebar">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                className={`settings-nav-item ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon size={17} />

                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}

        <div className="settings-content">
          {/* =================================================
              STORE
          ================================================= */}

          {activeSection === "store" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h2>Store Settings</h2>

                  <p>Configure basic information about your ecommerce store.</p>
                </div>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label>Store Name</label>

                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Store Email</label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Currency</label>

                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR — Indian Rupee</option>

                    <option value="USD">USD — US Dollar</option>

                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Store Description</label>

                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-card-footer">
                <button
                  className="save-button"
                  onClick={saveStoreSettings}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 size={16} className="spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              PROFILE
          ================================================= */}

          {activeSection === "profile" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h2>Admin Profile</h2>

                  <p>Manage your Clerk administrator profile.</p>
                </div>
              </div>

              <div className="profile-section">
                <div className="large-avatar">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || "Admin"} />
                  ) : (
                    (user?.firstName?.charAt(0) || "A").toUpperCase()
                  )}
                </div>

                <div>
                  <h3>{user?.fullName || "Admin"}</h3>

                  <p>Store Administrator</p>

                  {/* <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfileImage}
                  />

                  <button
                    className="secondary-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Upload size={15} />
                    Change Avatar
                  </button> */}
                </div>
              </div>

              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>

                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>

                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input type="email" value={profileEmail} readOnly />
                </div>
              </div>

              <div className="settings-card-footer">
                <button
                  className="save-button"
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 size={16} className="spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
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

                  <p>Choose which notifications you want to receive.</p>
                </div>
              </div>

              <div className="notification-list">
                <NotificationRow
                  title="New Orders"
                  description="Get notified when a new order is placed."
                  checked={notifications.newOrders}
                  onChange={() => toggleNotification("newOrders")}
                />

                <NotificationRow
                  title="Low Stock"
                  description="Receive alerts when products have low inventory."
                  checked={notifications.lowStock}
                  onChange={() => toggleNotification("lowStock")}
                />

                <NotificationRow
                  title="New Users"
                  description="Get notified when a new customer registers."
                  checked={notifications.newUsers}
                  onChange={() => toggleNotification("newUsers")}
                />

                <NotificationRow
                  title="Email Notifications"
                  description="Receive important store updates through email."
                  checked={notifications.emailNotifications}
                  onChange={() => toggleNotification("emailNotifications")}
                />
              </div>

              <div className="settings-card-footer">
                <button
                  className="save-button"
                  onClick={saveNotifications}
                  disabled={saving}
                >
                  <Save size={16} />

                  {saving ? "Saving..." : "Save Changes"}
                </button>
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

                  <p>Manage your Clerk account password.</p>
                </div>
              </div>

              <div className="settings-form">
                <PasswordInput
                  label="Current Password"
                  value={currentPassword}
                  setValue={setCurrentPassword}
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                />

                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  setValue={setNewPassword}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                />
              </div>

              <div className="settings-card-footer">
                <button
                  className="save-button"
                  onClick={updatePassword}
                  disabled={saving}
                >
                  <Shield size={16} />

                  {saving ? "Updating..." : "Update Password"}
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

                  <p>Configure payment methods available in your store.</p>
                </div>
              </div>

              <div className="payment-list">
                <PaymentRow
                  title="Cash on Delivery"
                  description="Allow customers to pay when their order arrives."
                  checked={payments.cod}
                  onChange={() => togglePayment("cod")}
                />

                <PaymentRow
                  title="Online Payment"
                  description="Accept payments through online payment gateways."
                  checked={payments.online}
                  onChange={() => togglePayment("online")}
                />

                <PaymentRow
                  title="UPI"
                  description="Allow customers to pay using UPI."
                  checked={payments.upi}
                  onChange={() => togglePayment("upi")}
                />
              </div>

              <div className="settings-card-footer">
                <button
                  className="save-button"
                  onClick={savePayments}
                  disabled={saving}
                >
                  <Save size={16} />

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// NOTIFICATION ROW
// =====================================================

const NotificationRow = ({ title, description, checked, onChange }) => {
  return (
    <div className="notification-item">
      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />

        <span />
      </label>
    </div>
  );
};

// =====================================================
// PAYMENT ROW
// =====================================================

const PaymentRow = ({ title, description, checked, onChange }) => {
  return (
    <div className="payment-item">
      <div className="payment-info">
        <div className="payment-icon">
          <CreditCard size={18} />
        </div>

        <div>
          <h3>{title}</h3>

          <p>{description}</p>
        </div>
      </div>

      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />

        <span />
      </label>
    </div>
  );
};

// =====================================================
// PASSWORD INPUT
// =====================================================

const PasswordInput = ({ label, value, setValue, show, setShow }) => {
  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="password-input">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button type="button" onClick={() => setShow(!show)}>
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
};

export default Settings;
