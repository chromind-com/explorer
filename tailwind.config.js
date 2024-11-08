/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'vt323': ['VT323', 'monospace', 'Courier New', 'Courier', 'monospace'],
      },
      colors: {
        'custom-bg': '#211926',
        'custom-secondary': '#2c2734',
        'custom-purple': '#cb8fe9',
      },
    },
  },
  plugins: [],
}

