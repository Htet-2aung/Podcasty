// src/components/ThemeToggle.tsx

import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-overlay transition-colors">
      <span className="font-medium text-text-secondary">Theme</span>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-overlay text-text-main hover:text-primary transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <MoonIcon className="w-5 h-5" />
        ) : (
          <SunIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;