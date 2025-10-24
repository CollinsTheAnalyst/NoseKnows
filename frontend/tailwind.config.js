// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        greatVibes: ['"Great Vibes"', 'cursive'],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        primaryBg: "#fff8f9",
        accentPink: "#ff2d81",
        accentBlue: "#0070f3",
        textDark: "#1a1a1a",
        neutralLight: "#f9f9f9",
        footerBg: "#1a1a1a",
      },
    },
  },
  plugins: [],
};
