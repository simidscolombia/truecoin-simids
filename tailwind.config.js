/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",
        secondary: "#16213E",
        accent: "#F5A623",
        'background-deep': "#1A1A2E",
        'background-card': "#16213E",
        'text-main': "#F8F9FA",
        gold: "#F5A623",
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
