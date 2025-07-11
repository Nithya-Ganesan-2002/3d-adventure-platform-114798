"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { login as apiLogin, register as apiRegister, UserCredentials, AuthResponse } from "@/api/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for JWT presence on mount
  useEffect(() => {
    const token = Cookies.get("jwt");
    setIsAuthenticated(!!token);
  }, []);

  // PUBLIC_INTERFACE
  async function login(credentials: UserCredentials) {
    setLoading(true);
    setError(null);
    try {
      const data: AuthResponse = await apiLogin(credentials);
      Cookies.set("jwt", data.access_token);
      setIsAuthenticated(true);
    } catch (err) {
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error - err.response typing from axios
        setError(err.response?.data?.detail || "Failed to login. Check your credentials.");
      } else {
        setError("Failed to login. Check your credentials.");
      }
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function register(credentials: UserCredentials) {
    setLoading(true);
    setError(null);
    try {
      const data: AuthResponse = await apiRegister(credentials);
      Cookies.set("jwt", data.access_token);
      setIsAuthenticated(true);
    } catch (err) {
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error - err.response typing from axios
        setError(err.response?.data?.detail || "Failed to register. Username may be taken.");
      } else {
        setError("Failed to register. Username may be taken.");
      }
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  function logout() {
    Cookies.remove("jwt");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
