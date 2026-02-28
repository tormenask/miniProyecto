/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand:   { DEFAULT: '#CD1F32', hover: '#b01a2a' },
        danger:  { bg: '#F4D6D2', text: '#691911', border: '#e8b5b0' },
        success: { bg: '#DCF1E3', text: '#1B4332', border: '#b4ddc0' },
        warning: { bg: '#FEF3C7', text: '#92400E', border: '#fde68a' },
        'app-bg':    '#F9F9F9',
        'card-head': '#E1E4E7',
      },
    },
  },
  plugins: [],
}