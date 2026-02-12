/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        "gold-dark": "#B8860B",
        "dark-bg": "#1A1A1A",
        "dark-secondary": "#2A2A2A",
      },
    },
  },
  plugins: [],
}
