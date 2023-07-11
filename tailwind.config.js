/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
      }
    }
  },
  plugins: [],
}
