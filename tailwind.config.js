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
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                navy: {
                    900: '#0F172A',
                    800: '#1E293B',
                    700: '#334155',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease forwards',
                'spin': 'spin 1s linear infinite',
            },
        },
    },

    plugins: [forms],
};
