/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // "Ledger" palette - deep teal-green for trust, amber for stamps/alerts,
        // rust-red for overdue/low-stock states. See design doc Section 1.
        paper: {
          light: '#F5F3EE',
          dark: '#12181F',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1B232C',
        },
        ledger: {
          50: '#EAF3F0',
          100: '#CFE5DD',
          300: '#7FBCA8',
          500: '#1F6F5C',
          600: '#195A4A',
          700: '#134639',
        },
        amber: {
          400: '#E0A526',
          500: '#D98E04',
        },
        rust: {
          400: '#D46B4C',
          500: '#C2492E',
        },
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
