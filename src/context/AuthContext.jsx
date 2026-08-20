import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5001/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // CHECK CURRENT USER
  // ===============================
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/me`,
        {
          withCredentials: true,
        }
      );

      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ===============================
  // REGISTER
  // ===============================
  const register = async (name, email, password) => {
    const response = await axios.post(
      `${API_URL}/register`,
      {
        name,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    setUser(response.data.user);

    return response.data;
  };

  // ===============================
  // LOGIN
  // ===============================
  const login = async (email, password) => {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    setUser(response.data.user);

    return response.data;
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = async () => {
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);