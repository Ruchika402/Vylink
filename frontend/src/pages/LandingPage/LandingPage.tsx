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
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#6C63FF]">
                🔗 Vylink
              </span>
              <span className="text-xs bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-1 rounded-full">
                Beta
              </span>
            </div>
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
      <Features />

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2026 Vylink. Secure Image Sharing.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button
              type="button"
              onClick={() => {}}
              className="hover:text-[#6C63FF] bg-transparent border-none cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="hover:text-[#6C63FF] bg-transparent border-none cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="hover:text-[#6C63FF] bg-transparent border-none cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
