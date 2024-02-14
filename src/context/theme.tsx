import React, { createContext, useCallback, useContext, useState } from "react";

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

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
    if (themeOnStorage && ['dark', 'light'].includes(themeOnStorage)) {
      return themeOnStorage as Theme
    }

    return 'dark';
  });

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const themeNewValue = (prevTheme === 'dark' ? 'light' : 'dark')
      localStorage.setItem('theme', themeNewValue)

      return themeNewValue
    })
  }, [setTheme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}