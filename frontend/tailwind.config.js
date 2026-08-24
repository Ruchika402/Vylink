/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        "primary-dark": "#5A52D5",
        secondary: "#00C9A7",
        accent: "#FF6B6B",
      },
    },
  },
  plugins: [],
};
