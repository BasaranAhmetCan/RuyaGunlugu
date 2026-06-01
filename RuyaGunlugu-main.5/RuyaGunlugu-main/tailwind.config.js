/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS değişkenleri ile tema desteği — dark/light mod otomatik geçiş
        'dream-dark':   'var(--dream-dark)',
        'dream-mid':    'var(--dream-mid)',
        'dream-light':  'var(--dream-light)',
        'dream-accent': 'var(--dream-accent)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
