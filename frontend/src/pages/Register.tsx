import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await api.post("/register/", { username: email, email, password, name });
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C63FF]/5 to-[#00C9A7]/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#6C63FF] mb-2">
          🚀 Create Account
        </h1>
        <p className="text-gray-500 mb-6">Join Vylink</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#6C63FF] text-white py-3 rounded-lg hover:bg-[#5A52D5] transition"
          >
            Create Account →
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#6C63FF]">
            Sign in →
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;