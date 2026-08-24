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
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-gray-600 hover:text-primary transition cursor-pointer"
              >
                Pricing
              </a>
              {/* ✅ NEW: Docs */}
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  alert("📚 Documentation coming soon!");
                }}
                className="text-sm font-medium text-gray-600 hover:text-primary transition cursor-pointer"
              >
                Docs
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
                {/* Dark Mode Toggle */}
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
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <Features />
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">About Vylink</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We're on a mission to make secure file sharing simple, fast, and
            accessible for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
              Democratize secure file sharing by making enterprise-grade
              encryption available to everyone.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Security First
            </h3>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
              End-to-end encryption, OWASP compliance, and regular security
              audits to protect your data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900">Open Source</h3>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
              Built with transparency. All code is open-source and
              community-driven.
            </p>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
<section
  id="pricing"
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 rounded-2xl mt-16"
>
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
      Choose the plan that works for you.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Free Plan */}
    <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary hover:shadow-[0_0_25px_rgba(108,99,255,0.3)] transition-all duration-300 cursor-pointer">
      <h3 className="text-xl font-semibold text-gray-900">Free</h3>
      <p className="text-3xl font-bold text-primary mt-4">$0</p>
      <p className="text-sm text-gray-500">per month</p>
      <ul className="mt-6 space-y-3 text-sm text-gray-600">
        <li>✓ 5 files per month</li>
        <li>✓ 10MB file size limit</li>
        <li>✓ Basic sharing</li>
      </ul>
      <button className="mt-6 w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
        Get Started
      </button>
    </div>

    {/* Pro Plan */}
    <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary hover:shadow-[0_0_25px_rgba(108,99,255,0.3)] transition-all duration-300 cursor-pointer relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
        RECOMMENDED
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
      <p className="text-3xl font-bold text-primary mt-4">$9</p>
      <p className="text-sm text-gray-500">per month</p>
      <ul className="mt-6 space-y-3 text-sm text-gray-600">
        <li>✓ Unlimited files</li>
        <li>✓ 100MB file size limit</li>
        <li>✓ Advanced sharing</li>
        <li>✓ Analytics dashboard</li>
      </ul>
      <button className="mt-6 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
        Get Started
      </button>
    </div>

    {/* Enterprise Plan */}
    <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary hover:shadow-[0_0_25px_rgba(108,99,255,0.3)] transition-all duration-300 cursor-pointer">
      <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
      <p className="text-3xl font-bold text-primary mt-4">$29</p>
      <p className="text-sm text-gray-500">per month</p>
      <ul className="mt-6 space-y-3 text-sm text-gray-600">
        <li>✓ Unlimited files</li>
        <li>✓ 1GB file size limit</li>
        <li>✓ Custom branding</li>
        <li>✓ Priority support</li>
      </ul>
      <button className="mt-6 w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
        Contact Sales
      </button>
    </div>
  </div>
</section>

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
