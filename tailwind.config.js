/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#CC0000', pd: '#990000', pl: '#FF2222',
        gold: '#F5C518', gd: '#D4A017',
        ink: '#111111', ink2: '#333', ink3: '#555', ink4: '#888',
        surface: '#FFFFFF', surf2: '#F8F8F8', surf3: '#F2F2F2',
        border: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        bebas: ['Bebas Neue','sans-serif'],
        mont: ['Montserrat','sans-serif'],
        inter: ['Inter','sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp .6s ease forwards',
        'fade-in': 'fadeIn .4s ease forwards',
        'pulse-red': 'pulseRed 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from:{ opacity:0, transform:'translateY(24px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn: { from:{ opacity:0 }, to:{ opacity:1 } },
        pulseRed: { '0%,100%':{ boxShadow:'0 0 0 0 rgba(204,0,0,.4)' }, '50%':{ boxShadow:'0 0 0 10px rgba(204,0,0,0)' } },
        float: { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
      }
    }
  },
  plugins: []
}
