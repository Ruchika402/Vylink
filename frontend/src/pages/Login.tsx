import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      console.log("📤 Logging in with:", { username, password }); // Debug
      await login(username, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-primary text-center mb-2">
          🔐 Vylink
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Welcome back! Sign in to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            disabled={loading}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium text-lg ${loading ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"}`}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
