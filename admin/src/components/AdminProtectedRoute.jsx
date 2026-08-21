import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = () => {
  const {
    user,
    loading,
  } = useAuth();

  // ==========================================
  // CHECKING AUTHENTICATION
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "#0f1716",
        }}
      >
        Loading...
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // ==========================================
  // CHECK ADMIN ROLE
  // ==========================================

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // ==========================================
  // ADMIN AUTHENTICATED
  // ==========================================

  return <Outlet />;
};

export default AdminProtectedRoute;