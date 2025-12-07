import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import axios from "axios";

// ----------------- TYPES -----------------
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  loginWithFacebook: (accessToken: string, userID: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

// ----------------- CONTEXT -----------------
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------- PROVIDER -----------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    if (t) setToken(t);
  }, []);

  // Fetch current user whenever token changes
  useEffect(() => {
    (async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const me = await apiGet<AuthUser>("/api/auth/me", undefined, token);
        setUser(me);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // ----------------- METHODS -----------------

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Please provide email and password.");
    const res = await apiPost<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    setToken(res.token);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    if (!name || !email || !password) throw new Error("Please provide name, email and password.");
    const res = await apiPost<{ token: string; user: AuthUser }>("/api/auth/signup", { name, email, password, phone });
    setToken(res.token);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user);
  };

  const loginWithGoogle = async (googleToken: string) => {
    if (!googleToken) throw new Error("Missing Google token.");
    const { data } = await axios.post<{ token: string; user: AuthUser }>("/api/auth/google", { token: googleToken });
    setToken(data.token);
    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
  };

  const loginWithFacebook = async (accessToken: string, userID: string) => {
    if (!accessToken || !userID) throw new Error("Missing Facebook credentials.");
    const { data } = await axios.post<{ token: string; user: AuthUser }>("/api/auth/facebook", { accessToken, userID });
    setToken(data.token);
    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const refresh = async () => {
    if (!token) return;
    const me = await apiGet<AuthUser>("/api/auth/me", undefined, token);
    setUser(me);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, signup, loginWithGoogle, loginWithFacebook, logout, refresh }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ----------------- HOOK -----------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
