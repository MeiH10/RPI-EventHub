import React, { createContext } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const { isDark, setIsDark } = useColorScheme();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme: isDark ? 'dark' : 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
