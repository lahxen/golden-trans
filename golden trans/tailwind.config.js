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
          primary: '#1a3a5c',
          'primary-content': '#ffffff',
          secondary: '#d4a843',
          'secondary-content': '#1a3a5c',
          accent: '#f8f6f1',
          'accent-content': '#1a1a2e',
          neutral: '#2c3e50',
          'neutral-content': '#f8fafc',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#eef2f6',
          'base-content': '#1e293b',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
  },
}
