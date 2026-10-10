/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        vinted: {
          light: '#0097a7',
          DEFAULT: '#007782',
          dark: '#00565e',
        }
      }
    },
  },
  plugins: [],
}