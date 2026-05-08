/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D6A55C",
      },

      fontFamily: {
        adam: ["Adam", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 25px rgba(214,165,92,0.35)",
      },
    },
  },
  plugins: [],
};