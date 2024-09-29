import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            animation:{
                'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                'shake' : {
                    '10%, 90%': {
                        transform: 'translate3d(-1px, 0, 0)'
                    },
                    '20%, 80%' : {
                        transform: 'translate3d(2px, 0, 0)'
                    },
                    '30%, 50%, 70%': {
                        transform: 'translate3d(-4px, 0, 0)'
                    },
                    '40%, 60%': {
                        transform: 'translate3d(4px, 0, 0)'
                    }
                }
            }
        },
    },

    plugins: [forms],
};
