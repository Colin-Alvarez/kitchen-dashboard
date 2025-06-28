import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kitchenBlue: '#d7e9f7',
      },
      backgroundImage: {
        maple: "url('/maple-wood-texture.jpg')",
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      fontFamily: {
        handwriting: ['"Gloria Hallelujah"', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
