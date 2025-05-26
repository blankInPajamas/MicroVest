// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // These are the files Tailwind CSS will scan for class names
    "./index.html", // If your main HTML file is at the root
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS, JSX, TS, TSX files in your src folder
    // Add any other paths where you use Tailwind classes, e.g.:
    // "./public/index.html",
    // "./components/**/*.{js,jsx,ts,tsx}",
    // "./pages/**/*.{js,jsx,ts,tsx}", // If using Next.js
  ],
  theme: {
    extend: {
      // This is where you can add your custom colors, fonts, spacing, etc.
      // Example:
      // colors: {
      //   'brand-blue': '#1DA1F2',
      //   'dark-gray': '#1A202C',
      // },
    },
  },
  plugins: [
    // Add any Tailwind CSS plugins here, e.g.:
    // require('@tailwindcss/typography'),
  ],
}