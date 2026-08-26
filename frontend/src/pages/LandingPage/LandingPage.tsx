import React from "react";
import { Link } from "react-router-dom";
import Hero from "./Hero";
import Features from "./Features";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C63FF]/5 via-white to-[#00C9A7]/5">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* LEFT: Logo + Brand */}
            <div className="flex items-center space-x-3">
              <img
                src="favicon.ico.png"
                alt="Vylink Logo"
                className="h-9 w-auto transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,99,255,0.6)] hover:scale-105 rounded-xl"
              />
              <span className="text-2xl font-bold text-[#6C63FF]">Vylink</span>
            </div>

            {/* CENTER: Nav Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-gray-600 hover:text-primary transition cursor-pointer"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-gray-600 hover:text-primary transition cursor-pointer"
              >
                About
              </a>
              <Link
                to="/public"
                className="text-sm font-medium text-gray-600 hover:text-primary transition cursor-pointer"
              >
                Public Feed
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-primary transition"
              >
                Dashboard
              </Link>
            </div>

            {/* RIGHT: Sign In + Get Started */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-[#6C63FF] transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#6C63FF] text-white px-6 py-2 rounded-lg hover:bg-[#5A52D5] transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Hero />

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Features />
      </section>
{/* ===== ABOUT SECTION ===== */}
<section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-900">About Vylink</h2>
    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
      A security-focused image sharing platform built as a full-stack portfolio project.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Card 1 - Portfolio Project */}
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Portfolio Project</h3>
      <p className="mt-2 text-gray-500 text-sm leading-relaxed">
        Built to demonstrate full-stack development skills with Django, React, and security best practices.
      </p>
    </div>

    {/* Card 2 - Security First */}
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Security First</h3>
      <p className="mt-2 text-gray-500 text-sm leading-relaxed">
        Follows OWASP Top 10 guidelines with JWT authentication, httpOnly cookies, and input sanitization.
      </p>
    </div>

    {/* Card 3 - Open Source */}
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Open Source</h3>
      <p className="mt-2 text-gray-500 text-sm leading-relaxed">
        Source code is publicly available on GitHub. Built with transparency.
      </p>
    </div>
  </div>
</section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-xl mb-4">🔗 Vylink</h3>
              <p className="text-sm text-gray-400">
                Secure image sharing built with OWASP Top 10 guidelines.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
                <li><Link to="/public" className="text-gray-400 hover:text-white transition">Public Feed</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About</a></li>
                <li>
                  <a 
                    href="https://github.com/Ruchika402/Vylink" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#!" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#!" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2026 Vylink. Built with ❤️ by Ruchika Adak</p>
            <div className="flex space-x-6 mt-2 sm:mt-0">
              <a 
                href="https://github.com/Ruchika402/Vylink" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition"
              >
                GitHub
              </a>
              <a href="#!" className="hover:text-white transition">Privacy</a>
              <a href="#!" className="hover:text-white transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;