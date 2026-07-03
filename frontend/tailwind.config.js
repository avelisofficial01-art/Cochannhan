/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gu: {
          gold: '#D4A843',
          jade: '#2D8B57',
          blood: '#8B1A1A',
          soul: '#6B3FA0',
          dark: '#1A1A2E',
          darker: '#0F0F23',
        },
      },
      fontFamily: {
        fantasy: ['MedievalSharp', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
