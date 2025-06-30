/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'sf-pro': ['SF Pro Text', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae0ff',
          300: '#7cc8ff',
          400: '#36acff',
          500: '#0c91ff',
          600: '#2B6BE6',
          700: '#1557c7',
          800: '#1849a0',
          900: '#1a3f7e',
        },
        secondary: {
          50: '#F7F9FC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        'typing': 'typing 0.05s steps(1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 80%, 100%': { opacity: '0.3' },
          '40%': { opacity: '1' },
        },
        'typing': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'glow': {
          'from': { boxShadow: '0 0 20px -10px rgba(43, 107, 230, 0.5)' },
          'to': { boxShadow: '0 0 20px -5px rgba(43, 107, 230, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};