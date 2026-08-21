import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK ADMIN AUTHENTICATION
  // ==========================================

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "/auth/admin/me"
      );

      console.log("ADMIN ME:", response.data);

      setUser(response.data.admin);
    } catch (error) {
      console.log(
        "Admin authentication failed:",
        error.response?.status,
        error.response?.data
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK ADMIN WHEN APP STARTS
  // ==========================================

  useEffect(() => {
    checkAuth();
  }, []);

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const login = async (email, password) => {
    const response = await axios.post(
      "/auth/admin/login",
      {
        email,
        password,
      }
    );

    console.log(
      "ADMIN LOGIN RESPONSE:",
      response.data
    );

    const loggedInAdmin = response.data.admin;

    if (loggedInAdmin.role !== "admin") {
      throw new Error(
        "You do not have admin access."
      );
    }

    setUser(loggedInAdmin);

    return loggedInAdmin;
  };

  // ==========================================
  // ADMIN LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      await axios.post(
        "/auth/admin/logout"
      );
    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};