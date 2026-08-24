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

            {/* CENTER: Nav Links (now outside logo div) */}
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
      <Features />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-xl mb-4">🔗 Vylink</h3>
              <p className="text-sm text-gray-400">
                Secure image sharing with enterprise-grade encryption.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/files"
                    className="text-gray-400 hover:text-white transition"
                  >
                    My Files
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Careers
                  </a>
                </li>{" "}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/Ruchika402"
                    className="text-gray-400 hover:text-white transition"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-gray-400 hover:text-white transition"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2026 Vylink. Secure Image Sharing.</p>
            <div className="flex space-x-6 mt-2 sm:mt-0">
              <a href="#!" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#!" className="hover:text-white transition">
                Terms
              </a>
              <a href="#!" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
