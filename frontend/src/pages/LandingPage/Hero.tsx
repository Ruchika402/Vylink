import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center">
        <div className="inline-block bg-[#6C63FF]/10 text-[#6C63FF] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          🔒 Enterprise-Grade Security
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
          Share & Manage Your Images
          <span className="block text-[#6C63FF]">
            With Military-Grade Security
          </span>
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Enterprise-grade file sharing with end-to-end encryption. All your
          files, one secure link. Trusted by 142,000+ users.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-[#6C63FF] text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#5A52D5] transition shadow-lg hover:shadow-xl"
          >
            Get Started Free →
          </Link>
          <button className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:border-[#6C63FF] hover:text-[#6C63FF] transition">
            Watch Demo ▶
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span>142,000+ files shared</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔒</span>
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span>Lightning fast</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
