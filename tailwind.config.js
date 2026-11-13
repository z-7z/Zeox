/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: { xs: '400px' },
      colors: {
        page: '#000000',
        panel: '#06090B',
        card: { DEFAULT: '#0B1012', hover: '#11191C' },
        line: { DEFAULT: '#263036', soft: '#182024' },
        txt: { primary: '#E6ECEE', secondary: '#98A6AA', muted: '#606C70' },
        white: '#E6ECEE',
        neon: {
          cyan: '#5CD4E6',
          blue: '#8BCBDD',
          green: '#7BD9C2',
          yellow: '#FFB364',
          orange: '#FF9150',
          pink: '#F2A6C7',
          red: '#F07D86',
        },
        'accent-cyan': '#5CD4E6',
        'accent-green': '#7BD9C2',
        'accent-red': '#F07D86',
        'accent-yellow': '#FFB364',
        'accent-blue': '#8BCBDD',
        'accent-orange': '#FF9150',
        'accent-pink': '#F2A6C7',
        ok: '#7BD9C2',
        warn: '#FFB364',
        err: '#F07D86',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.42s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.3s ease both',
        'scale-in': 'scaleIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.985)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
