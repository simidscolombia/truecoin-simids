import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themeService, ThemeColors, DEFAULT_THEME } from '../services/themeService';

interface ThemeContextType {
    theme: ThemeColors;
    setColor: (key: keyof ThemeColors, value: string) => Promise<void>;
    resetTheme: () => Promise<void>;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    setColor: async () => { },
    resetTheme: async () => { },
    isLoading: true,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);
    const [isLoading, setIsLoading] = useState(true);

    // Load theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            const loaded = await themeService.getTheme();
            setTheme(loaded);
            themeService.applyToDOM(loaded);
            setIsLoading(false);
        };
        loadTheme();
    }, []);

    const setColor = useCallback(async (key: keyof ThemeColors, value: string) => {
        const updated = { ...theme, [key]: value };
        setTheme(updated);
        themeService.applyToDOM(updated);
        await themeService.saveColor(key, value);
    }, [theme]);

    const resetTheme = useCallback(async () => {
        setTheme(DEFAULT_THEME);
        themeService.applyToDOM(DEFAULT_THEME);
        await themeService.saveTheme(DEFAULT_THEME);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setColor, resetTheme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
}
