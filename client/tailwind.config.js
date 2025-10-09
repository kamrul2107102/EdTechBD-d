/** @type {import('tailwindcss').Config} */
export default {
  // ✅ Enable dark mode using the 'class' strategy
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // ✅ Custom font for headings and logo
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "course-details-heading-small": ["26px", "36px"],
        "course-details-heading-large": ["36px", "44px"],
        "home-heading-small": ["36px", "34px"],
        "home-heading-large": ["48px", "56px"],
        default: ["15px", "21px"],
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fit, minmax(200px, 1fr))",
      },
      spacing: {
        "section-height": "500px",
      },
      maxWidth: {
        "course-card": "424px",
      },
      boxShadow: {
        "custom-card": "0px 4px 15px 2px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        brandBlue: "#1E40AF",
        brandIndigo: "#4F46E5",
      },
    },
  },
  plugins: [],
};
