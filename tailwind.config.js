/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        // OLED palette: true black base with restrained accents
        page: '#000000',
        panel: '#050507',
        card: {
          DEFAULT: '#0B0B0F',
          hover: '#141419',
        },
        line: {
          DEFAULT: '#24242C',
          soft: '#1A1A20',
        },
        txt: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#777681',
        },
        neon: {
          purple: '#A78BFA',
          blue: '#8DCFE6',
          cyan: '#8DCFE6',
          green: '#8DCFE6',
          yellow: '#E8A7C8',
          orange: '#F2A56F',
          red: '#E8A7C8',
        },
        'accent-green': '#8DCFE6',
        'accent-red': '#E8A7C8',
        'accent-purple': '#A78BFA',
        'accent-yellow': '#E8A7C8',
        'accent-blue': '#8DCFE6',
        'accent-orange': '#F2A56F',
        // Compatibility aliases (legacy tokens)
          ok: '#8DCFE6',
          warn: '#F2A56F',
          err: '#E8A7C8',
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
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3.2s ease-in-out infinite',
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
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-24px) scale(1.05)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
