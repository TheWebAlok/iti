/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        navy: { 950: '#06142A', 900: '#0B1F3A', 800: '#102A4C', 700: '#173761', 600: '#24477A' },
        royal: { 400: '#5B8DEF', 500: '#2F6BEA', 600: '#1D4ED8', 700: '#1E40AF' },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,31,58,.05), 0 8px 24px -8px rgba(11,31,58,.12)',
      },
    },
  },
  plugins: [],
};
