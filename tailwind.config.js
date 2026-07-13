/** @type {import('tailwindcss').Config} */
// NOTE: Tailwind v4 uses CSS-first configuration via @theme in globals.css.
// This file only exists for tooling compatibility (e.g. some IDE extensions).
// Colors and breakpoints are defined in app/globals.css @theme block.
// Do NOT add colors or breakpoints here — use globals.css instead.
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};