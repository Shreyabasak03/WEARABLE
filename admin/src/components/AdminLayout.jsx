import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import adminApi from "../api/axios";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  X,
  ShoppingBag,
  Package,
  UserPlus,
} from "lucide-react";

import "./AdminLayout.css";

const AdminLayout = () => {
  const [popupNotification, setPopupNotification] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await adminApi.get("/notifications");

        const notifications = response.data.notifications || [];

        if (notifications.length === 0) {
          return;
        }

        const latest = notifications[0];

        if (lastNotificationId === null) {
          setLastNotificationId(latest._id);
          return;
        }

        if (latest._id !== lastNotificationId) {
          setPopupNotification(latest);
          setLastNotificationId(latest._id);

          setTimeout(() => {
            setPopupNotification(null);
          }, 5000);
        }
      } catch (error) {
        console.error("NOTIFICATION CHECK ERROR:", error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [lastNotificationId]);

  return (
    <div className="admin-layout">
      {popupNotification && (
        <div className="notification-popup">
          <div className="notification-popup-icon">
            {popupNotification.type === "order" && <ShoppingBag size={20} />}
            {popupNotification.type === "low_stock" && <Package size={20} />}
            {popupNotification.type === "user" && <UserPlus size={20} />}
          </div>

          <div className="notification-popup-content">
            <strong>{popupNotification.title}</strong>
            <p>{popupNotification.message}</p>
          </div>

          <button onClick={() => setPopupNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <Sidebar />

      <div className="admin-main">
        <Topbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;