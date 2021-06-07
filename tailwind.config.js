const { guessProductionMode } = require("@ngneat/tailwind");
const { teal } = require("tailwindcss/colors");
const colors = require('tailwindcss/colors');

module.exports = {
    prefix: '',
    purge: {
        enabled: guessProductionMode(),
        content: [
            './src/**/*.{html,ts}',
        ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {},
        colors: {
            white: colors.white,
            gray: colors.gray,
            green: colors.green,
            orange: colors.orange,
            red: colors.red,
            blue: colors.blue,
            background: colors.gray,
            primary: colors.gray,
            secondary: colors.red,
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};