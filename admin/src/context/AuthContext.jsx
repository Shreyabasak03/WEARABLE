import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5001/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK ADMIN AUTHENTICATION
  // ==========================================

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/admin/me`,
        {
          withCredentials: true,
        }
      );

      setUser(response.data.admin);

    } catch (error) {
      console.log("Admin not authenticated");
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
      `${API_URL}/auth/admin/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    // console.log(
    //   "ADMIN LOGIN RESPONSE:",
    //   response.data
    // );

    const loggedInAdmin = response.data.admin;

    // console.log(
    //   "LOGGED IN ADMIN:",
    //   loggedInAdmin
    // );

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
        `${API_URL}/auth/admin/logout`,
        {},
        {
          withCredentials: true,
        }
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