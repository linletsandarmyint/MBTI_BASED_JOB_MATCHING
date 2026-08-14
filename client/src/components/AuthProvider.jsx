import React, { createContext, useState, useEffect } from "react";
import api from "../api/authApi";

export const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/profile");
      // support responses shaped either as { user } or direct user
      setUser(res.data.user || res.data || null);
    } catch (err) {
      console.warn("Failed to load user profile:", err.message || err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // listen for token changes in other tabs
    const handler = () => loadUser();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
