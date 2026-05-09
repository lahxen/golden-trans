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
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        navy: {
          primary: '#0d3b66',
          'primary-content': '#ffffff',
          secondary: '#faa916',
          'secondary-content': '#0d3b66',
          accent: '#1e6f9f',
          neutral: '#1a2940',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f3f6fa',
          'base-300': '#dee5ed',
          'base-content': '#16324f',
          info: '#2563eb',
          success: '#16a34a',
          warning: '#f59e0b',
          error: '#dc2626',
        },
      },
    ],
  },
}
