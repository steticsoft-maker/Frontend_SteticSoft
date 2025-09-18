import React, { createContext, useState, useEffect, useMemo } from 'react';

// 1. Crear el Contexto
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// 2. Crear el Proveedor del Contexto
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Prioridad: localStorage > System Preference > Default ('light')
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Aplicar la clase al body y guardar en localStorage
    const body = window.document.body;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Usar useMemo para evitar que el valor del contexto se recree en cada render
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
