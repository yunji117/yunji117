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
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      backdropFilter: {
        'glass': 'blur(20px)',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(17, 24, 39, 0.3)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-in': 'slideIn 1s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          '@apply backdrop-blur-md bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl': {},
        },
        '.glass-dark': {
          '@apply backdrop-blur-md bg-black bg-opacity-30 border border-white border-opacity-10 rounded-xl': {},
        },
        '.text-gradient': {
          '@apply bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400': {},
        },
        '.text-gradient-alt': {
          '@apply bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400': {},
        },
      });
    }),
  ],
}