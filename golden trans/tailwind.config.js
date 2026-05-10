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
          50: '#fdf8e8',
          100: '#f9ecc4',
          200: '#f3dd9c',
          300: '#e8c97a',
          400: '#d4a843',
          500: '#D4AF37',
          600: '#b8962e',
          700: '#9a7d25',
          800: '#7c641d',
          900: '#5e4b15',
        },
      },
      boxShadow: {
        gold: '0 4px 24px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.40)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
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
          secondary: '#D4AF37',
          'secondary-content': '#1a3a5c',
          accent: '#f5f0e8',
          'accent-content': '#1a1a2e',
          neutral: '#2c3e50',
          'neutral-content': '#f8fafc',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#eef2f6',
          'base-content': '#1e293b',
          info: '#1a3a5c',
          'info-content': '#ffffff',
          success: '#2d7d46',
          'success-content': '#ffffff',
          warning: '#D4AF37',
          'warning-content': '#1a3a5c',
          error: '#c24141',
          'error-content': '#ffffff',
        },
      },
    ],
  },
}