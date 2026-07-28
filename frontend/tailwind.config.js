/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keeping class just in case, but default will be light
  theme: {
    extend: {
      colors: {
        wm: {
          background: '#f4f6f8', // Light grey background
          card: '#ffffff',
          textMain: '#1e293b', // Slate 800
          textMuted: '#64748b', // Slate 500
          border: '#e2e8f0', // Slate 200
          blue: {
            DEFAULT: '#005a8d', // Main deep blue for accents and bars
            light: '#e6f0f5', // Light blue background for active states
            hover: '#004a75'
          },
          green: {
            DEFAULT: '#15803d', // Green for line chart and positive numbers
            light: '#dcfce7'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.025)',
      }
    },
  },
  plugins: [],
}
