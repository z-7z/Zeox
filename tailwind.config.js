/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#09090B',
        panel: '#111113',
        card: {
          DEFAULT: '#18181B',
          hover: '#1E1E22',
        },
        line: {
          DEFAULT: '#26262B',
          soft: '#1F1F24',
        },
        txt: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        'accent-green': '#22C55E',
        'accent-red': '#EF4444',
        // Compatibility aliases (legacy tokens)
        ok: '#22C55E',
        warn: '#FBBF24',
        err: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'pulse-dot': 'pulseDot 2.4s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
