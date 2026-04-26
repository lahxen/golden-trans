/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#e8c97a',
          400: '#d4a843',
          500: '#c9a227',
          600: '#a88520',
        },
      },
      boxShadow: {
        gold:    '0 4px 24px rgba(201, 162, 39, 0.25)',
        'gold-lg': '0 8px 40px rgba(201, 162, 39, 0.40)',
      },
    },
  },
  plugins: [],
}
