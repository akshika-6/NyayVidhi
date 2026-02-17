import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("nyayvidhi_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing...');
    try {
      const savedUser = localStorage.getItem("nyayvidhi_user");
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        console.log('AuthContext: User loaded from localStorage');
      } else {
        console.log('AuthContext: No saved user or token');
      }
    } catch (e) {
      console.error("Failed to load user", e);
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Loading complete');
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("nyayvidhi_token", data.access_token);
    localStorage.setItem("nyayvidhi_user", JSON.stringify(data.user));
    return data;
  };

  const signup = async (name, email, password, preferredLanguage) => {
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, preferred_language: preferredLanguage }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Signup failed");
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("nyayvidhi_token", data.access_token);
    localStorage.setItem("nyayvidhi_user", JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("nyayvidhi_token");
    localStorage.removeItem("nyayvidhi_user");
    localStorage.removeItem("nyayvidhi_chats"); // Optional: clear chats on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
