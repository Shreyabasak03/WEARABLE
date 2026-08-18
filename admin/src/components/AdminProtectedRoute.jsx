import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/react";

const AdminProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUser();

  // Clerk is checking authentication
  if (!isLoaded) {
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

  // User is NOT logged in
  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // User IS logged in
  return <Outlet />;
};

export default AdminProtectedRoute;