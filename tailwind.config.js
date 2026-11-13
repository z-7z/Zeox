/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        // OLED palette: true black base, vivid accents tuned for OLED
        page: '#000000',
        panel: '#0A0A0A',
        card: {
          DEFAULT: '#101012',
          hover: '#16161A',
        },
        line: {
          DEFAULT: '#232329',
          soft: '#1A1A1E',
        },
        txt: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        'accent-green': '#22C55E',
        'accent-red': '#EF4444',
        'accent-purple': '#A78BFA',
        'accent-yellow': '#FACC15',
        'accent-blue': '#60A5FA',
        'accent-orange': '#FB923C',
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
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.35s ease both',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.98)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
