/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stl-green': '#004d40',
        'stl-dark': '#00332b',
      }
    },
  },
  plugins: [],
}