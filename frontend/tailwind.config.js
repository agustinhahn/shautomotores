/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50', // Elegant Deep Blue
        secondary: '#BDC3C7', // Silver/Gray
        accent: '#C0A080', // Gold/Sand
        dark: '#1A252F', // Very Dark Blue
        light: '#F4F7F6', // Off-White/Light Gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
