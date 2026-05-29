import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeColor = 'purple' | 'blue' | 'green' | 'pink' | 'orange';

interface ThemeContextType {
  darkMode: boolean;
  themeColor: ThemeColor;
  toggleDarkMode: () => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColorState] = useState<ThemeColor>('purple');

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    const savedColor = (localStorage.getItem('themeColor') as ThemeColor) || 'purple';
    setDarkMode(isDark);
    setThemeColorState(savedColor);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    
    document.documentElement.setAttribute('data-theme', savedColor);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
    document.documentElement.setAttribute('data-theme', color);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, themeColor, toggleDarkMode, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
