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
        // Orange-only brand palette. The "purple/violet/lavender" tokens are
        // kept as names for compatibility but now resolve to orange tones.
        brand: {
          purple: '#FF7411', // primary accent (was purple) — now primary orange
          violet: '#FF963D', // secondary accent (was violet) — now light orange
          lavender: '#FFC091', // soft accent (was lavender) — now pale orange
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
      animation: {
        'pulse-dot': 'pulseDot 2.4s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'sheen': 'sheen 7s ease-in-out infinite',
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
        sheen: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
