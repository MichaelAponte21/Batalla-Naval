/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        classic: {
          bg: '#0b1e2d',
          deep: '#06141f',
          brass: '#c9a96e',
          parchment: '#e8d9b0',
          rust: '#8b3a1f',
          fog: '#7a8a9a'
        },
        scifi: {
          bg: '#0a0e1a',
          deep: '#050810',
          cyan: '#00e5ff',
          orange: '#ff6a00',
          violet: '#8b5cf6',
          grid: '#1a3a5c'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Orbitron"', 'monospace']
      },
      animation: {
        'wave': 'wave 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'scan': 'scan 2s linear infinite',
        'flicker': 'flicker 3s linear infinite'
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px,0,0)' },
          '20%, 80%': { transform: 'translate3d(2px,0,0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px,0,0)' },
          '40%, 60%': { transform: 'translate3d(4px,0,0)' }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      }
    }
  },
  plugins: []
};
