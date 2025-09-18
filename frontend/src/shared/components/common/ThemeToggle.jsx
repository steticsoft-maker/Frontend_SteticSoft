import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${isDarkMode ? 'claro' : 'oscuro'}`}
      title={`Cambiar a tema ${isDarkMode ? 'claro' : 'oscuro'}`}
    >
      <div className="theme-toggle-icon">
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </div>
      <span className="theme-toggle-text">
        {isDarkMode ? 'Día' : 'Noche'}
      </span>
    </button>
  );
};

export default ThemeToggle;
