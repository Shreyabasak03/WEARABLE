import React from "react";
import { SignIn } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/react";

const Login = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  // Already logged in
  if (isSignedIn) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f1716",
      }}
    >
      <SignIn
        routing="path"
        path="/admin/login"
        forceRedirectUrl="/admin/dashboard"
      />
    </div>
  );
};

export default Login;