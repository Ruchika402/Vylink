import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api, { resetUnauthorizedFlag } from "../api/client";
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

  useEffect(() => {
    let isMounted = true;
    let isRedirecting = false;
const PUBLIC_PATHS = ['/login', '/register', '/'];
    const checkAuth = async () => {
      // ✅ Reset unauthorized flag on auth check
      resetUnauthorizedFlag();
      
      try {
        const response = await api.get("/user/");
        if (isMounted) {
          setUser(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.log("❌ Not authenticated:", error);
          setUser(null);
          setLoading(false);
          // ✅ Only redirect to login if not already on login page
          const isPublicRoute = PUBLIC_PATHS.includes(window.location.pathname);
          if (!isRedirecting && !isPublicRoute) {
            isRedirecting = true;
            window.location.href = "/login";
          }
        }
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // ✅ Reset unauthorized flag before login
      resetUnauthorizedFlag();
      
      await api.post("/token/", { username, password });
      const userResponse = await api.get("/user/");
      setUser(userResponse.data);
      toast.success("Welcome back! 🎉");
      
      // ✅ Redirect to dashboard after login
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data);
      toast.error(error.response?.data?.detail || "Invalid credentials");
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      resetUnauthorizedFlag();
      
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
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Registration failed");
      throw error;
    }
  };

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