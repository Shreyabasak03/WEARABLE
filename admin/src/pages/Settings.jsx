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

import { useAuth } from "../context/AuthContext";

import "./Settings.css";

// =====================================================
// API URL
// =====================================================

const API_URL = "http://localhost:5001/api/settings";

const Settings = () => {

  // =====================================================
  // CUSTOM JWT AUTH
  // =====================================================

  const { user, token, setUser } = useAuth();

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

  const [name, setName] = useState("");

  const [profileEmail, setProfileEmail] = useState("");

  const [profileImage, setProfileImage] = useState("");

  // =====================================================
  // PASSWORD
  // =====================================================

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
  // AUTH HEADERS
  // =====================================================

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  const showMessage = (text) => {
    setMessage(text);

    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const showError = (text) => {
    setError(text);

    setMessage("");

    setTimeout(() => {
      setError("");
    }, 4000);
  };

  // =====================================================
  // LOAD ADMIN PROFILE FROM AUTH CONTEXT
  // =====================================================

  useEffect(() => {

    if (user) {

      setName(user.name || "");

      setProfileEmail(user.email || "");

      setProfileImage(user.image || user.imageUrl || "");

    }

  }, [user]);

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  const fetchSettings = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        API_URL,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = response.data.settings;

      if (!data) {
        setLoading(false);
        return;
      }

      // =================================================
      // STORE
      // =================================================

      setStoreName(
        data.storeName || ""
      );

      setEmail(
        data.email || ""
      );

      setPhone(
        data.phone || ""
      );

      setCurrency(
        data.currency || "INR"
      );

      setDescription(
        data.description || ""
      );

      // =================================================
      // NOTIFICATIONS
      // =================================================

      if (data.notifications) {

        setNotifications({
          newOrders:
            data.notifications.newOrders ?? true,

          lowStock:
            data.notifications.lowStock ?? true,

          newUsers:
            data.notifications.newUsers ?? true,

          emailNotifications:
            data.notifications.emailNotifications ?? false,
        });

      }

      // =================================================
      // PAYMENTS
      // =================================================

      if (data.payments) {

        setPayments({
          cod:
            data.payments.cod ?? true,

          online:
            data.payments.online ?? true,

          upi:
            data.payments.upi ?? true,
        });

      }

    } catch (err) {

      console.error(
        "SETTINGS FETCH ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to load settings"
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // LOAD SETTINGS ON PAGE LOAD
  // =====================================================

  useEffect(() => {

    if (token) {
      fetchSettings();
    } else {
      setLoading(false);
    }

  }, [token]);

  // =====================================================
  // SAVE STORE SETTINGS
  // =====================================================

  const saveStoreSettings = async () => {

    try {

      setSaving(true);

      await axios.put(
        `${API_URL}/store`,
        {
          storeName,
          email,
          phone,
          currency,
          description,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      showMessage(
        "Store settings saved successfully"
      );

    } catch (err) {

      console.error(
        "STORE SETTINGS ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to save store settings"
      );

    } finally {

      setSaving(false);

    }

  };

  // =====================================================
  // SAVE ADMIN PROFILE
  // =====================================================

  const saveProfile = async () => {

    if (!user) {

      showError(
        "Admin user not found"
      );

      return;

    }

    if (!name.trim()) {

      showError(
        "Name cannot be empty"
      );

      return;

    }

    try {

      setSaving(true);

      const response = await axios.put(
        `${API_URL}/profile`,
        {
          name: name.trim(),
        },
        {
          headers: getAuthHeaders(),
        }
      );

      // =================================================
      // UPDATE AUTH CONTEXT
      // =================================================

      if (response.data.user && setUser) {

        setUser(response.data.user);

      } else if (setUser) {

        setUser({
          ...user,
          name: name.trim(),
        });

      }

      showMessage(
        "Profile updated successfully"
      );

    } catch (err) {

      console.error(
        "PROFILE UPDATE ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);

    }

  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const handleProfileImage = async (event) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    // -------------------------------------------------
    // Basic validation
    // -------------------------------------------------

    if (!file.type.startsWith("image/")) {

      showError(
        "Please select an image file"
      );

      return;

    }

    if (file.size > 5 * 1024 * 1024) {

      showError(
        "Image must be smaller than 5MB"
      );

      return;

    }

    try {

      setSaving(true);

      const formData = new FormData();

      formData.append(
        "image",
        file
      );

      const response = await axios.put(
        `${API_URL}/profile/image`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // =================================================
      // UPDATE PROFILE IMAGE
      // =================================================

      const updatedImage =
        response.data.image ||
        response.data.user?.image ||
        "";

      setProfileImage(updatedImage);

      if (
        response.data.user &&
        setUser
      ) {

        setUser(
          response.data.user
        );

      }

      showMessage(
        "Profile image updated successfully"
      );

    } catch (err) {

      console.error(
        "PROFILE IMAGE ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to update profile image"
      );

    } finally {

      setSaving(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    }

  };

  // =====================================================
  // SAVE NOTIFICATIONS
  // =====================================================

  const saveNotifications = async () => {

    try {

      setSaving(true);

      await axios.put(
        `${API_URL}/notifications`,
        notifications,
        {
          headers: getAuthHeaders(),
        }
      );

      showMessage(
        "Notification settings saved"
      );

    } catch (err) {

      console.error(
        "NOTIFICATION ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to save notifications"
      );

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

      await axios.put(
        `${API_URL}/payments`,
        payments,
        {
          headers: getAuthHeaders(),
        }
      );

      showMessage(
        "Payment settings saved"
      );

    } catch (err) {

      console.error(
        "PAYMENT SETTINGS ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to save payment settings"
      );

    } finally {

      setSaving(false);

    }

  };

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  const updatePassword = async () => {

    if (!currentPassword) {

      showError(
        "Enter your current password"
      );

      return;

    }

    if (!newPassword) {

      showError(
        "Enter a new password"
      );

      return;

    }

    if (newPassword.length < 8) {

      showError(
        "Password must be at least 8 characters"
      );

      return;

    }

    if (newPassword !== confirmPassword) {

      showError(
        "Passwords do not match"
      );

      return;

    }

    try {

      setSaving(true);

      await axios.put(
        `${API_URL}/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");

      showMessage(
        "Password updated successfully"
      );

    } catch (err) {

      console.error(
        "PASSWORD ERROR:",
        err
      );

      showError(
        err.response?.data?.message ||
        "Failed to update password"
      );

    } finally {

      setSaving(false);

    }

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="settings-page">

        <div className="settings-loading">

          <Loader2
            size={24}
            className="spin"
          />

          <span>
            Loading settings...
          </span>

        </div>

      </div>

    );

  }

  // =====================================================
  // TOGGLE NOTIFICATION
  // =====================================================

  const toggleNotification = (key) => {

    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  };

  // =====================================================
  // TOGGLE PAYMENT
  // =====================================================

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

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="settings-header">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Manage your store and admin preferences.
          </p>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (

        <div className="settings-message success">

          <CheckCircle size={17} />

          {message}

        </div>

      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div className="settings-message error">

          <AlertCircle size={17} />

          {error}

        </div>

      )}


      {/* =================================================
          MAIN SETTINGS LAYOUT
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

                  <h2>
                    Store Settings
                  </h2>

                  <p>
                    Configure basic information about your ecommerce store.
                  </p>

                </div>

              </div>


              <div className="settings-form">


                <div className="form-group">

                  <label>
                    Store Name
                  </label>

                  <input
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
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
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

                    <Loader2
                      size={16}
                      className="spin"
                    />

                  ) : (

                    <Save size={16} />

                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

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

                  <h2>
                    Admin Profile
                  </h2>

                  <p>
                    Manage your administrator profile.
                  </p>

                </div>

              </div>


              {/* PROFILE HEADER */}

              <div className="profile-section">

                <div className="large-avatar">

                  {profileImage ? (

                    <img
                      src={profileImage}
                      alt={name || "Admin"}
                    />

                  ) : (

                    (name?.charAt(0) || "A")
                      .toUpperCase()

                  )}

                </div>


                <div>

                  <h3>
                    {name || "Admin"}
                  </h3>

                  <p>
                    Store Administrator
                  </p>


                  {/* IMAGE INPUT */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfileImage}
                  />


                  <button
                    className="secondary-button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={saving}
                  >

                    <Upload size={15} />

                    Change Avatar

                  </button>

                </div>

              </div>


              {/* PROFILE FORM */}

              <div className="settings-form">

                <div className="form-group">

                  <label>
                    Name
                  </label>

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={profileEmail}
                    readOnly
                  />

                </div>


                <div className="form-group">

                  <label>
                    Role
                  </label>

                  <input
                    value={
                      user?.role || "admin"
                    }
                    readOnly
                  />

                </div>

              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={saveProfile}
                  disabled={saving}
                >

                  {saving ? (

                    <Loader2
                      size={16}
                      className="spin"
                    />

                  ) : (

                    <Save size={16} />

                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

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

                  <h2>
                    Notifications
                  </h2>

                  <p>
                    Choose which notifications you want to receive.
                  </p>

                </div>

              </div>


              <div className="notification-list">

                <NotificationRow
                  title="New Orders"
                  description="Get notified when a new order is placed."
                  checked={
                    notifications.newOrders
                  }
                  onChange={() =>
                    toggleNotification(
                      "newOrders"
                    )
                  }
                />


                <NotificationRow
                  title="Low Stock"
                  description="Receive alerts when products have low inventory."
                  checked={
                    notifications.lowStock
                  }
                  onChange={() =>
                    toggleNotification(
                      "lowStock"
                    )
                  }
                />


                <NotificationRow
                  title="New Users"
                  description="Get notified when a new customer registers."
                  checked={
                    notifications.newUsers
                  }
                  onChange={() =>
                    toggleNotification(
                      "newUsers"
                    )
                  }
                />


                <NotificationRow
                  title="Email Notifications"
                  description="Receive important store updates through email."
                  checked={
                    notifications.emailNotifications
                  }
                  onChange={() =>
                    toggleNotification(
                      "emailNotifications"
                    )
                  }
                />

              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={saveNotifications}
                  disabled={saving}
                >

                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

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

                  <h2>
                    Security
                  </h2>

                  <p>
                    Manage your admin account password.
                  </p>

                </div>

              </div>


              <div className="settings-form">

                <PasswordInput
                  label="Current Password"
                  value={currentPassword}
                  setValue={setCurrentPassword}
                  show={showCurrentPassword}
                  setShow={
                    setShowCurrentPassword
                  }
                />


                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  setValue={setNewPassword}
                  show={showNewPassword}
                  setShow={
                    setShowNewPassword
                  }
                />


                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  show={showConfirmPassword}
                  setShow={
                    setShowConfirmPassword
                  }
                />

              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={updatePassword}
                  disabled={saving}
                >

                  <Shield size={16} />

                  {saving
                    ? "Updating..."
                    : "Update Password"}

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

                  <h2>
                    Payment Settings
                  </h2>

                  <p>
                    Configure payment methods available in your store.
                  </p>

                </div>

              </div>


              <div className="payment-list">

                <PaymentRow
                  title="Cash on Delivery"
                  description="Allow customers to pay when their order arrives."
                  checked={
                    payments.cod
                  }
                  onChange={() =>
                    togglePayment("cod")
                  }
                />


                <PaymentRow
                  title="Online Payment"
                  description="Accept payments through online payment gateways."
                  checked={
                    payments.online
                  }
                  onChange={() =>
                    togglePayment("online")
                  }
                />


                <PaymentRow
                  title="UPI"
                  description="Allow customers to pay using UPI."
                  checked={
                    payments.upi
                  }
                  onChange={() =>
                    togglePayment("upi")
                  }
                />

              </div>


              <div className="settings-card-footer">

                <button
                  className="save-button"
                  onClick={savePayments}
                  disabled={saving}
                >

                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

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

const NotificationRow = ({
  title,
  description,
  checked,
  onChange,
}) => {

  return (

    <div className="notification-item">

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>


      <label className="toggle">

        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />

        <span />

      </label>

    </div>

  );

};


// =====================================================
// PAYMENT ROW
// =====================================================

const PaymentRow = ({
  title,
  description,
  checked,
  onChange,
}) => {

  return (

    <div className="payment-item">

      <div className="payment-info">

        <div className="payment-icon">

          <CreditCard size={18} />

        </div>


        <div>

          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>

        </div>

      </div>


      <label className="toggle">

        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />

        <span />

      </label>

    </div>

  );

};


// =====================================================
// PASSWORD INPUT
// =====================================================

const PasswordInput = ({
  label,
  value,
  setValue,
  show,
  setShow,
}) => {

  return (

    <div className="form-group">

      <label>
        {label}
      </label>


      <div className="password-input">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          placeholder={`Enter ${label.toLowerCase()}`}
        />


        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
        >

          {show ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}

        </button>

      </div>

    </div>

  );

};


export default Settings;