/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./login.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bbe5cb',
          300: '#8dd1a9',
          400: '#5bb580',
          500: '#369960',
          600: '#287a4b',
          700: '#21613d',
          800: '#1d4e33',
          900: '#19402b',
        },
        eceng: {
          50: '#f7f4f0',
          100: '#ede6d9',
          200: '#dcc9b5',
          300: '#c6a589',
          400: '#b18360',
          500: '#9c6c43',
          600: '#8a5d3b',
          700: '#714c33',
          800: '#5e402f',
          900: '#4f362a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
