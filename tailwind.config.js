/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add dark mode specific colors
        dark: {
          DEFAULT: '#1a1a1a',
          'accent': '#2d2d2d',
          'lighter': '#373737'
        }
      }
    },
  },
  plugins: [],
};