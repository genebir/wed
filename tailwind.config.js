/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: { 50: '#FDF6F5', 100: '#FAEAE8', 200: '#F5D5D2', 400: '#E8AFA9' },
        beige: { 50: '#FAF7F2', 100: '#F3EDE3', 200: '#E8DECD', 400: '#C9B896' },
        ink: '#1D1D1F',
        muted: '#6E6E73',
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif KR"', 'ui-serif', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        pop: 'pop 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
