import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
        Share & Manage Your Images{" "}
        <span className="text-primary">With Security-First Design</span>
      </h1>
      <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
        A full-stack image sharing platform built with OWASP Top 10 guidelines.
        End-to-end encryption, JWT authentication, and shareable links with expiry.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/register"
          className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition shadow-md"
        >
          Get Started Free →
        </Link>
        <a
          href="https://github.com/Ruchika402/Vylink"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:border-primary hover:text-primary transition"
        >
          View on GitHub
        </a>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
        <span>🔒 End-to-end encryption</span>
        <span>⚡ Shareable links with expiry</span>
        <span>📊 Analytics dashboard</span>
      </div>
    </section>
  );
};

export default Hero;