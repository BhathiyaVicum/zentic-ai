/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        // Text colors
        'primary-text': '#FFFFFF',
        'secondary-text': '#00D497',

        // brand colors
        'brand-dark': '#00261B',
        'brand-medium': '#00684A',
        'brand-light': '#01B985',
        'brand-muted': '#013E2C',
        'brand-hover': '#E3FFF7',
        'brand-dark-div': '#001C14',
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

        // Top Glow Gradient
        'top-bg-gradient': 'radial-gradient(circle at top, #013E2C 0%, transparent 70%)',

        'subtopic-heading': 'linear-gradient(307.73deg, #00261b00 0%, #00261bff 51%, #00261b00 98%)',

        'step-btn': 'linear-gradient(307.73deg, rgba(0, 38, 27, 0) 0%, rgba(0, 38, 27, 1) 51%, rgba(0, 38, 27, 0) 98%)',

        'footer-bg': 'linear-gradient(180deg, #013e2cff 0%, #001c14ff 100%)',

        'footer-line': 'linear-gradient(307.73deg, #01261bff 0%, #01b985ff 20%, #01b985ff 78%, #01261bff 100%)',

      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}