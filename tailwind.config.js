/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#b08d57",
        accent: "#f7f3ed",
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        serif: ["GFS Didot", "Georgia", "serif"],
      },
      animation: {
        "spin-slow": "spin 1.5s linear infinite",
        "pulse-subtle": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backdropBlur: {
        sm: "8px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
