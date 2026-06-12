import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export type ThemeType = 'light' | 'dark' | 'liquid-glass' | 'neon';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('user-panel-theme');
    // automatic upgrade from glass to liquid-glass
    if (saved === 'glass') return 'liquid-glass';
    return (saved as ThemeType) || 'light';
  });
  
  const location = useLocation();

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('user-panel-theme', newTheme);
  };

  useEffect(() => {
    const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/contact'];
    const isPublic = publicPaths.includes(location.pathname) || 
                     location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/legal');
    
    if (isPublic) {
      document.documentElement.setAttribute('data-theme', 'light');
      // Also reset any class that might have been added to body by other themes?
      // UserLayout handles the background decor via React rendering, so document class is enough.
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, location.pathname]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
