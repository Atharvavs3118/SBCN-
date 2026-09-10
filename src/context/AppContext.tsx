import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation, LanguageOption, translateOnline } from '../utils/i18n';
import { useTheme } from './ThemeContext';

export type AppView = 'LANDING' | 'LOGIN' | 'WIZARD' | 'CHECKLIST' | 'DASHBOARD' | 'PROFILE';

interface AppContextType {
  // Theme
  isDark: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Language
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  languages: LanguageOption[];
  t: (key: string, fallback?: string) => string;
  translateDynamic: (text: string) => Promise<string>;
  isTranslating: boolean;

  // Navigation View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Authenticated user state
  isAuthenticated: boolean;
  loginAsFounder: (email?: string, name?: string) => void;
  logout: () => void;
  founderName: string;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_LANG = 'aura_lang_v1';
const STORAGE_AUTH = 'aura_auth_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Delegate theme state to ThemeContext
  const { theme, isDark, toggleTheme } = useTheme();

  // Language State
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG) as SupportedLanguage;
      if (saved && ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'en';
  });

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG, newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(lang, key, fallback);
  };

  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const translateDynamic = async (text: string): Promise<string> => {
    if (!text || lang === 'en') return text;
    setIsTranslating(true);
    try {
      const res = await translateOnline(text, lang);
      return res;
    } catch {
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [founderName, setFounderName] = useState<string>(() => {
    return localStorage.getItem('aura_founder_name') || 'Atharva Sankhe';
  });

  // Current View: By default as requested: "Firstly the landing page will open"
  const [currentView, setCurrentView] = useState<AppView>('LANDING');

  const loginAsFounder = (email?: string, name?: string) => {
    const fName = name || 'Atharva Sankhe';
    setIsAuthenticated(true);
    setFounderName(fName);
    try {
      localStorage.setItem(STORAGE_AUTH, 'true');
      localStorage.setItem('aura_founder_name', fName);
      if (email) localStorage.setItem('aura_founder_email', email);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_AUTH);
    } catch (e) {
      console.error(e);
    }
    setCurrentView('LANDING');
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        theme,
        toggleTheme,
        lang,
        setLang,
        languages: SUPPORTED_LANGUAGES,
        t,
        translateDynamic,
        isTranslating,
        currentView,
        setCurrentView,
        isAuthenticated,
        loginAsFounder,
        logout,
        founderName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
