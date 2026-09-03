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
          950: '#07090d',
          900: '#0e1117',
          800: '#141820',
          700: '#1e2430',
        },
        volt: {
          DEFAULT: '#ffd000',
          hover: '#ffe45e',
          dim: 'rgba(255, 208, 0, 0.12)',
        },
        tech: {
          cyan: '#38bdf8',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Plus Jakarta Sans', 'sans-serif'],
        outfit: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
