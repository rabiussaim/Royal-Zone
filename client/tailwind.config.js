/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'navy': { 900: '#0A0F1E', 800: '#0D1426', 700: '#111827' },
        'gold': { 400: '#D4B483', 500: '#C9A96E', 600: '#B8955A' },
        'cream': { 50: '#FAFAF8', 100: '#F5F0E8', 200: '#EDE5D8' },
        'crimson': {
          950: '#1A0000',
          900: '#2D0A0A',
          800: '#4A0F0F',
          700: '#6B1414',
          600: '#7B1C1C',
          500: '#8B2020',
          400: '#A02525',
        },
        'charcoal': {
          950: '#050505',
          900: '#0A0A0A',
          800: '#141414',
          700: '#1C1C1C',
          600: '#242424',
          500: '#2E2E2E',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'zoom-in': 'zoomIn 0.6s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      boxShadow: {
        'gold': '0 4px 30px rgba(201,169,110,0.3)',
        'luxury': '0 20px 60px rgba(0,0,0,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
}
