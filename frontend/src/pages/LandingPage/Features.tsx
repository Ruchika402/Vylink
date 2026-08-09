import React from "react";

const features = [
  {
    icon: "🔒",
    title: "End-to-End Encryption",
    description:
      "Your files are encrypted before they leave your device. Only you and your recipients can access them.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    description:
      "Access your files from any device - desktop, tablet, or mobile. Full responsive design.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description:
      "Optimized CDN delivery and intelligent caching ensure your files load instantly.",
  },
  {
    icon: "🔗",
    title: "Smart Link Management",
    description:
      "Generate shareable links with expiration dates, password protection, and view limits.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description:
      "Track views, downloads, and engagement with detailed analytics and insights.",
  },
  {
    icon: "🛡️",
    title: "OWASP Compliant",
    description:
      "Built with security-first principles. Protected against XSS, CSRF, and injection attacks.",
  },
];

const Features: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">
          Built for Security & Speed
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Everything you need to share files securely with your team, clients,
          or the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
