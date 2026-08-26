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
        {/* ✅ End-to-End Encryption */}
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          End-to-end encryption
        </span>
        {/* ✅ Shareable links with expiry */}
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Shareable links with expiry
        </span>
        {/* ✅ Analytics dashboard */}
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics dashboard
        </span>
      </div>
    </section>
  );
};

export default Hero;