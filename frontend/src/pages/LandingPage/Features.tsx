import React from "react";

const features = [
  {
    icon: "🔒",
    title: "End-to-End Encryption",
    desc: "Your files are encrypted before they leave your device. Only you and your recipients can access them.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    desc: "JWT with httpOnly cookies, Google OAuth, and email confirmation for secure access.",
  },
  {
    icon: "🔗",
    title: "Shareable Links",
    desc: "Generate shareable links with expiration dates, password protection, and view limits.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Track views, downloads, and engagement with detailed analytics and insights.",
  },
  {
    icon: "🛡️",
    title: "OWASP Top 10",
    desc: "Built following OWASP Top 10 security guidelines — including XSS, CSRF, and injection protection.",
  },
  {
    icon: "📖",
    title: "Open Source",
    desc: "Source code is publicly available on GitHub. Built with transparency and community contributions welcome.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Built for Security & Transparency</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Everything you need to share files securely — built with OWASP Top 10 guidelines.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;