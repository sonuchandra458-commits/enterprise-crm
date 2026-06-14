/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-up':       'fadeUp 0.4s ease-out both',
        'fade-in':       'fadeIn 0.3s ease-out both',
        'slide-in-left': 'slideInLeft 0.35s ease-out both',
        'bounce-in':     'bounceIn 0.5s ease-out both',
      },
      keyframes: {
        fadeUp:      { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        bounceIn:    { '0%': { transform: 'scale(0.9)', opacity: '0' }, '70%': { transform: 'scale(1.02)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      }
    },
  },
  plugins: [],
}