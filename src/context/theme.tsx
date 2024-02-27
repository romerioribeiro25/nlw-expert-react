import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = 'light' | 'dark' | 'system'

type UserPrefersTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setPrefersTheme: (prefersTheme: Theme) => void;
  userPrefersTheme: UserPrefersTheme;
}

const ThemeContext = createContext({} as ThemeContextType)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
} 

export function ThemeProvider({ children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => { 
    const themeOnStorage = localStorage.getItem('theme');
    if (themeOnStorage && ['dark', 'light', 'system'].includes(themeOnStorage)) { 
      return themeOnStorage as Theme
    }

    return 'dark';
  });

  // const windowPrefersColorScheme = useMemo<UserPrefersTheme>(() => {
  //   const prefersColorShemeDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   return prefersColorShemeDark ? 'dark' : 'light';
  // }, []);

  const [windowPrefersColorScheme, setWindowPrefersColorScheme] = useState<UserPrefersTheme>(() => { 
    const prefersColorShemeDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersColorShemeDark ? 'dark' : 'light';
  }); 

  useEffect(() => {
    const handleColorSchemeChange = () => {
      setWindowPrefersColorScheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleColorSchemeChange);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  const setPrefersTheme = useCallback((prefersTheme: Theme) => {
    localStorage.setItem('theme', prefersTheme)
    setTheme(prefersTheme)
  }, [setTheme]);

  const userPrefersTheme = useMemo(() => (theme === 'system') ? windowPrefersColorScheme: theme, [theme, windowPrefersColorScheme]);

  const memoizedValue = useMemo(() => ({
    theme, setPrefersTheme, userPrefersTheme 
  }), [theme, setPrefersTheme, userPrefersTheme]);
 
  return (
    <ThemeContext.Provider value={memoizedValue}>
      {children}
    </ThemeContext.Provider>
  )
}