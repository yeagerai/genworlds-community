/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,json}',  '../../use_cases/**/*.{json}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'), 
  ],
  daisyui: {
    themes: ["light", "dark",
        // {
        //   genworlds-theme: {
        //     "primary": "#a991f7",
        //     "secondary": "#f6d860",
        //     "accent": "#37cdbe",
        //     "neutral": "#3d4451",
        //     "base-100": "#ffffff",
        //   },
        // },
      ],
    },
  purge: {
    options: {
      safelist: [
        /^chat-bubble-/,
        /^font-/,
        "italic",
      ], 
    },
  },
}

