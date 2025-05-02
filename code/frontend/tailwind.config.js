/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark Theme
                dark: {
                    background: '#1E1E2E',
                    surface: '#282838',
                    text: '#E4E4E7',
                },
                // Light Theme
                light: {
                    background: '#F8F8FC',
                    surface: '#FFFFFF',
                    text: '#1E1E2E',
                },
                // Accent Colors
                accent: {
                    primary: '#7C3AED',    // vibrant purple
                    secondary: '#10B981',  // emerald green
                    tertiary: '#3B82F6',   // bright blue
                    warning: '#F59E0B',    // amber
                    error: '#EF4444',      // red
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}