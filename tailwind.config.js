/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Defines 'font-sans' to use Segoe UI or fallbacks
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      // Custom keyframes for the animated background
      keyframes: {
        waveFlow: {
          '0%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-5%) translateY(-2%) rotate(1deg)' },
          '50%': { transform: 'translateX(5%) translateY(2%) rotate(-1deg)' },
          '75%': { transform: 'translateX(-3%) translateY(-1%) rotate(0.5deg)' },
        },
      },
      // Custom animation using the defined keyframes
      animation: {
        'wave-flow': 'waveFlow 20s ease-in-out infinite',
      },
      // Custom background gradients for avatars
      backgroundImage: {
        'avatar-1-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'avatar-2-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'avatar-3-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'avatar-4-gradient': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      // Custom grid columns for the consultant cards to ensure auto-fit behavior
      gridTemplateColumns: {
        'auto-fit-320': 'repeat(auto-fit, minmax(320px, 1fr))',
      }
    },
  },
  plugins: [],
}