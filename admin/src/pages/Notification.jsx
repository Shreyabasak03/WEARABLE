import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Bell,
  ShoppingBag,
  Package,
  UserPlus,
  CheckCheck,
  Trash2,
} from "lucide-react";

import "./Notification.css";

const API_URL = "http://localhost:5001/api/notifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(API_URL);

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "FETCH NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Check for new notifications every 5 seconds
    const interval = setInterval(
      fetchNotifications,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // MARK AS READ
  // ==========================================

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // MARK ALL READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${API_URL}/read-all`
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/${id}`
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // ICON
  // ==========================================

  const getIcon = (type) => {
    if (type === "order") {
      return <ShoppingBag size={18} />;
    }

    if (type === "low_stock") {
      return <Package size={18} />;
    }

    if (type === "user") {
      return <UserPlus size={18} />;
    }

    return <Bell size={18} />;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      {/* HEADER */}

      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with activity in your store.
          </p>
        </div>

        {notifications.some(
          (notification) =>
            !notification.isRead
        ) && (
          <button
            className="mark-all-button"
            onClick={markAllAsRead}
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}

      </div>


      {/* NOTIFICATIONS */}

      <div className="notifications-card">

        {notifications.length === 0 ? (

          <div className="empty-notifications">

            <Bell size={40} />

            <h3>No notifications</h3>

            <p>
              New orders, users and stock alerts
              will appear here.
            </p>

          </div>

        ) : (

          notifications.map(
            (notification) => (

              <div
                key={notification._id}
                className={`notification-card ${
                  !notification.isRead
                    ? "unread"
                    : ""
                }`}
                onClick={() =>
                  markAsRead(
                    notification._id
                  )
                }
              >

                <div
                  className={`notification-icon ${notification.type}`}
                >
                  {getIcon(
                    notification.type
                  )}
                </div>


                <div className="notification-content">

                  <h3>
                    {notification.title}
                  </h3>

                  <p>
                    {notification.message}
                  </p>

                  <span>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </span>

                </div>


                <button
                  className="notification-delete"
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteNotification(
                      notification._id
                    );
                  }}
                >
                  <Trash2 size={16} />
                </button>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
};

export default Notifications;