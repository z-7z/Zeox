/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#000000',
          soft: '#050507',
          surface: '#0A0A0F',
          elevated: '#111116',
        },
        card: {
          DEFAULT: '#101014',
          elevated: '#15141B',
        },
        'card-border': '#292333',
        brand: {
          purple: '#8B5CF6',
          violet: '#A855F7',
          lavender: '#C4B5FD',
          orange: '#FF7411',
          orangeLight: '#FF963D',
          orangeDeep: '#E85D04',
        },
        txt: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        ok: '#34D399',
        warn: '#FBBF24',
        err: '#F87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        zeox: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'pulse-dot': 'pulseDot 2.4s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
