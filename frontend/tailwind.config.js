/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        weather: {
          clear: '#F59E0B',
          clearLight: '#FBBF24',
          rain: '#3B82F6',
          rainLight: '#60A5FA',
          snow: '#06B6D4',
          snowLight: '#22D3EE',
          cloudy: '#64748B',
          cloudyLight: '#94A3B8',
          storm: '#6366F1',
          stormLight: '#818CF8',
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'md': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
        'lg': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.08)',
        'xl': '0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
        'glass': '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1', fontWeight: '700' }],
        'heading': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'title': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      keyframes: {
        // Sun animations
        'sunPulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'sunRotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'riseUp': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) scale(0.5)', opacity: '0' },
        },
        // Rain animations
        'rainFall': {
          '0%': { transform: 'translateY(-10px) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) translateX(-20px)', opacity: '0' },
        },
        'splash': {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        // Snow animations
        'snowFall': {
          '0%': { transform: 'translateY(-10px) translateX(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) translateX(30px) rotate(360deg)' },
        },
        'snowDrift': {
          '0%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(10px)' },
        },
        // Cloud animations
        'cloudDrift': {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(calc(100vw + 100px))' },
        },
        // Storm animations
        'lightning': {
          '0%, 95%, 100%': { opacity: '0' },
          '96%': { opacity: '0.8' },
          '97%': { opacity: '0' },
          '98%': { opacity: '0.5' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        // Material animations
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'fadeUp': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
      },
      animation: {
        'sun-pulse': 'sunPulse 4s ease-in-out infinite',
        'sun-rotate': 'sunRotate 20s linear infinite',
        'rise-up': 'riseUp 6s ease-in infinite',
        'rain-fall': 'rainFall var(--duration, 1s) linear infinite',
        'splash': 'splash 1.5s ease-out infinite',
        'snow-fall': 'snowFall var(--duration, 3s) linear infinite',
        'snow-drift': 'snowDrift var(--drift, 2s) ease-in-out infinite alternate',
        'cloud-drift': 'cloudDrift var(--speed, 20s) linear infinite',
        'lightning': 'lightning var(--interval, 5s) infinite',
        'shake': 'shake 0.5s',
        'ripple': 'ripple 0.6s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
