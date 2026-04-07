/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDF9F6',
          100: '#FDF6F0',
          200: '#F9EDE1',
          300: '#F5E4D2',
        },
        rose: {
          light: '#FADADD',
          DEFAULT: '#E8A0B4',
          medium: '#D4799A',
          dark: '#C4637E',
          deep: '#A34B65',
        },
        beige: {
          light: '#FAF3ED',
          DEFAULT: '#F0E0D0',
          dark: '#E0C8B4',
        },
        navy: '#1E2D4E',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
    },
  },
  plugins: [],
}
