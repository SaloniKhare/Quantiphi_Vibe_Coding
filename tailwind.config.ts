/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          500: '#3b5bfd',
          600: '#2f47db',
          700: '#2536a8',
        },
      },
    },
  },
  plugins: [],
};
