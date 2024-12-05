/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            Regular: ['sans-serif'],
            Amatic: ['Amatic SC', 'sans-serif'],
            Advent: ['Advent Pro', 'sans-serif'],
            Pacifico: ['Pacifico', 'sans-serif'],
            Nunito: ['Nunito', 'sans-serif'],
        },
        boxShadow: {
            DEFAULT:
                '0px 9px 15px 0px #090E7B0D, 0px 6px 36px 0px #090E7B1F, 0px 0px 10px 0px #090E7B0D',
            highlight: '0px 0px 30px -3px #ffe9b2',
        },
        extend: {
            colors: {
                background: '#1a1c20',
            },
            screens: {
                small: { max: '212mm' }, // 210mm in pixels
            },
        },
    },
    plugins: [],
};
