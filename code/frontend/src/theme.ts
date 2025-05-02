import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme types
export type ThemeMode = 'dark' | 'light';

// Theme interface
export interface ThemeState {
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

// Theme colors based on the redesign plan
export const themeColors = {
    dark: {
        background: '#1E1E2E',
        surface: '#282838',
        text: '#E4E4E7',
    },
    light: {
        background: '#F8F8FC',
        surface: '#FFFFFF',
        text: '#1E1E2E',
    },
    accent: {
        primary: '#7C3AED',    // vibrant purple
        secondary: '#10B981',  // emerald green
        tertiary: '#3B82F6',   // bright blue
        warning: '#F59E0B',    // amber
        error: '#EF4444',      // red
    },
};

// Theme store with persistence
export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'dark', // Default to dark mode
            toggleTheme: () => set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
            setTheme: (mode: ThemeMode) => set({ mode }),
        }),
        {
            name: 'ai-pkm-theme',
        }
    )
);

// Typography
export const typography = {
    fontFamily: {
        sans: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
    },
    fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

// Spacing
export const spacing = {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
};

// Apply theme to document
export const applyTheme = (mode: ThemeMode) => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(mode);
    document.documentElement.classList.add('theme-transition');
};

// Export theme object for backward compatibility
const theme = {
    colors: themeColors,
    typography,
    spacing,
};

export default theme;