import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "../api/client";
import toast from "react-hot-toast";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check authentication ONLY ONCE on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await api.get("/user/");
        if (isMounted) setUser(response.data);
      } catch (error) {
        // ✅ CRITICAL: Catch the error and just set user to null
        if (isMounted) {
          console.log("❌ Not authenticated:", error);
          setUser(null);
        }
      } finally {
        // ✅ CRITICAL: ALWAYS turn off loading, even if it errors
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  // ✅ Login
  const login = async (username: string, password: string) => {
    try {
      await api.post("/token/", { username, password });
      const userResponse = await api.get("/user/");
      setUser(userResponse.data);
      toast.success("Welcome back! 🎉");
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data);
      toast.error(error.response?.data?.detail || "Invalid credentials");
      throw error;
    }
  };

  // ✅ Register
  const register = async (data: any) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        password2: data.confirm_password || data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      };

      await api.post("/register/", payload);
      await api.post("/token/", { username: data.username, password: data.password });
      const userResponse = await api.get("/user/");
      setUser(userResponse.data);
      toast.success("Account created! Welcome to Vylink 🎉");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Registration failed");
      throw error;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/logout/");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};