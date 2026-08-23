import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register({
      username: form.username,
      email: form.email,
      password: form.password,
      confirm_password: confirm, // ✅ Add this
      first_name: form.first_name,
      last_name: form.last_name,
    });
      navigate('/login');
    } catch (error) { /* handled in context */ } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-primary text-center mb-2">🚀 Vylink</h1>
        <p className="text-gray-500 text-center mb-8">Create your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
            <input type="text" name="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <input type="text" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
          <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
          <input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 8 chars)" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" required minLength={8} />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-medium text-lg ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}`}>{loading ? 'Creating Account...' : 'Create Account →'}</button>
        </form>
        <p className="text-center mt-6 text-gray-500 text-sm">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in →</Link></p>
      </div>
    </div>
  );
};

export default Register;