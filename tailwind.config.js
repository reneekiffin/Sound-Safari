/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Savanna primaries
        terracotta: {
          50: '#fbeee6',
          100: '#f4d6c2',
          200: '#e7a983',
          300: '#db7d4b',
          400: '#c45a26',
          500: '#a0441a',
          600: '#7a3214',
        },
        savanna: {
          50: '#fdf9ec',
          100: '#f7eac0',
          200: '#f0d486',
          300: '#e8bd4a',
          400: '#d9a221',
          500: '#b28118',
          600: '#8a6311',
        },
        sage: {
          50: '#eff5ea',
          100: '#d9e8cf',
          200: '#b0cd9f',
          300: '#86b06e',
          400: '#679148',
          500: '#4e7335',
          600: '#3b5728',
        },
        // Tropical accents
        parrot: {
          400: '#e24a3c',
          500: '#c23324',
        },
        toucan: {
          400: '#f2994a',
          500: '#d97a2a',
        },
        jungle: {
          400: '#2aa29a',
          500: '#1d7e77',
        },
        // Backgrounds
        cream: '#fbf5e7',
        dusk: '#f9e3c4',
        sky: '#bfe1f0',
      },
      fontFamily: {
        display: ['"Bagel Fat One"', '"Fraunces"', 'Georgia', 'serif'],
        heading: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Nunito"', '"Quicksand"', 'system-ui', 'sans-serif'],
        letter: ['"Andika"', '"Lexend"', '"Nunito"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(122, 50, 20, 0.25)',
        pop: '0 14px 0 -4px rgba(0, 0, 0, 0.12)',
        card: '0 6px 0 rgba(122, 50, 20, 0.18), 0 12px 24px -12px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        blob: '42% 58% 63% 37% / 44% 46% 54% 56%',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        breathe: 'breathe 3s ease-in-out infinite',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        floaty: 'floaty 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
