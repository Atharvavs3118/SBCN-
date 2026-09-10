import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();
  
  // Translation fallback
  let t = (key: string, fallback: string) => fallback;
  try {
    const app = useApp();
    if (app && app.t) {
      t = app.t;
    }
  } catch {
    // Component used standalone outside AppProvider
  }

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5B061E]/20 dark:focus:ring-rose-500/20 ${
        isDark
          ? 'border-slate-700 bg-slate-800/90 text-amber-300 hover:bg-slate-700 hover:text-amber-200 shadow-2xs'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
      } ${className}`}
      title={isDark ? t('themeLight', 'Switch to Light Mode') : t('themeDark', 'Switch to Dark Mode')}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-slate-600 transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
      {showLabel && (
        <span className="hidden sm:inline font-medium">
          {isDark ? t('themeLight', 'Light') : t('themeDark', 'Dark')}
        </span>
      )}
    </button>
  );
};

