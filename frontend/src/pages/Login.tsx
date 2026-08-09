import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/token/', { username: email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C63FF]/5 to-[#00C9A7]/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#6C63FF] mb-2">🔐 Welcome</h1>
        <p className="text-gray-500 mb-6">Back to Vylink</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#6C63FF] text-white py-3 rounded-lg hover:bg-[#5A52D5] transition"
          >
            Login →
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Don't have an account? <a href="/register" className="text-[#6C63FF]">Create one →</a>
        </p>
      </div>
    </div>
  );
};

export default Login;