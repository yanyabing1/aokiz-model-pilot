/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        secondary: '#0FC6C2',
        accent: '#722ED1',
        dark: '#1D2129',
        light: '#F2F3F5',
        'dark-blue': '#0E2E8A',
        'neon-blue': '#00F0FF',
        'neon-purple': '#BF5AF2'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 15px rgba(22, 93, 255, 0.5)',
        'glow-lg': '0 0 25px rgba(22, 93, 255, 0.7)'
      }
    },
  },
  plugins: [],
}