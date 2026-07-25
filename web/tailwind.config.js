/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: '#F6F1E4',
        ink: '#20241F',
        study: {
          50: '#F3F6F2',
          100: '#E3EBDF',
          400: '#6E8F5C',
          500: '#4F6F44',
          600: '#3D5735',
          700: '#2E4128',
        },
        gold: '#B08A3E',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
