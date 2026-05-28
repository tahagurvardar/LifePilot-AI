/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 60px rgba(18, 24, 38, 0.12)",
        "premium-dark": "0 24px 60px rgba(0, 0, 0, 0.34)"
      },
      colors: {
        ink: "#15171f",
        mist: "#f6f8fb",
        lagoon: "#10b981",
        cobalt: "#4f46e5",
        sun: "#f59e0b"
      },
      backgroundImage: {
        "soft-grid":
          "linear-gradient(rgba(79, 70, 229, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
