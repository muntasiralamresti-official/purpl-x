/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      screens: {
        xs: "375px",

        sm: "640px",

        md: "768px",

        lg: "1024px",

        xl: "1280px",

        "2xl": "1536px",

        "3xl": "1920px",
      },

      colors: {
        brand: "#6366f1",
        primary: "#111827",
      },
    },
  },

  plugins: [],
};