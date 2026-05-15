/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your exact colors from Figma
        'primary-text': '#FFFFFF',
        'secondary-text': '#00D497',

        // Your brand colors
        'brand-dark': '#00261B',
        'brand-medium': '#00684A',
        'brand-light': '#01B985',
        'brand-muted': '#013E2C',
        'brand-hover': '#E3FFF7',
      },
      backgroundImage: {
        // Button Gradient (127.73 degrees)
        'btn-primary': 'linear-gradient(127.73deg, #00261B 0%, #00684A 100%)',

        // Secondary Button Stroke (307.73 degrees)
        'btn-secondary-stroke': 'linear-gradient(307.73deg, #01B985 0%, #013E2C 100%)',

        // Sub Topics Gradient
        'sub-topics': 'linear-gradient(307.73deg, #013E2C 0%, #01B985 51%, #013E2C 100%)',

        // Line Gradient
        'line-grad': 'linear-gradient(307.73deg, #000000 0%, #01B985 51%, #000000 100%)',

        // Hero Background (your dark theme)
        'hero-bg': 'radial-gradient(circle at 10% 20%, #00261B, #000000)',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}