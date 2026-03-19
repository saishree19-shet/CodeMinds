/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    pink: '#f43f5e', // Vibrant pink/red
                    light: '#fdf2f8', // Soft pink background
                },
                card: {
                    blue: '#eff6ff',    // ELI5 background
                    yellow: '#fefce8',  // Duck background
                    green: '#f0fdf4',   // Senior background
                    purple: '#faf5ff',  // Meme background
                    red: '#fff1f2',     // Fix background
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
