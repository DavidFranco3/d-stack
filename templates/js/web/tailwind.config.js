/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0c10',
          800: '#12161f',
          700: '#1a202c',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
