import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
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
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/user/");
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("📤 AuthContext login:", { username, password }); // Debug

      const response = await api.post("/token/", { username, password });
      console.log("✅ Token response:", response.data);

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const userResponse = await api.get("/user/");
      console.log("✅ User response:", userResponse.data);

      setUser(userResponse.data);
      toast.success("Welcome back! 🎉");
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data);
      toast.error(error.response?.data?.detail || "Invalid credentials");
      throw error;
    }
  };

  const register = async (data: any) => {
  try {
    console.log("📤 Sending registration data:", data);

    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password || data.password,
      first_name: data.first_name,
      last_name: data.last_name,
    };

    // Step 1: Register the user
    await api.post("/register/", payload);

    // Step 2: Auto-login after registration
    const loginResponse = await api.post("/token/", {
      username: data.username,
      password: data.password
    });

    localStorage.setItem("access_token", loginResponse.data.access);
    localStorage.setItem("refresh_token", loginResponse.data.refresh);

    // Step 3: Get user data
    const userResponse = await api.get("/user/");
    setUser(userResponse.data);

    toast.success("Account created! Welcome to Vylink 🎉");
  } catch (error: any) {
    console.error("❌ Registration error:", error.response?.data);
    toast.error(error.response?.data?.detail || "Registration failed");
    throw error;
  }
};

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    toast.success("Logged out");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
