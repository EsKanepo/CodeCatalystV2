import React, { createContext, useContext, useEffect, useState } from "react";
import { clearApiAuth } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cc_user");
      if (stored) {
        const userData = JSON.parse(stored);
        // Ensure enrolled_courses field exists
        if (!userData.enrolled_courses) {
          userData.enrolled_courses = [];
        }
        return userData;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("cc_token") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("cc_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("cc_user");
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("cc_token", token);
      else localStorage.removeItem("cc_token");
    } catch {
      // ignore
    }
  }, [token]);

  const signOut = () => {
    setUser(null);
    setToken(null);
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("cc_user");
      localStorage.removeItem("cc_token");
      localStorage.removeItem("token");

      // Clear any cached progress data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('progress') || key.includes('codepoints'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch {
      // ignore
    }

    // Clear API auth header
    clearApiAuth();
  };

  const value = { user, token, setUser, setToken, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
