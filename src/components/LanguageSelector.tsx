import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportedLanguage } from '../utils/i18n';

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', compact = false }) => {
  const { lang, setLang, languages, isDark, t, isTranslating } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        id="navbar-language-dropdown"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition active:scale-95 ${
          isDark
            ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
        }`}
        title="Select Regional Language (Online Translation Service)"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className={`h-3.5 w-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'} ${isTranslating ? 'animate-spin' : ''}`} />
        <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {currentOption.scriptLabel}
        </span>
        <span className="hidden sm:inline font-semibold text-xs text-slate-800 dark:text-slate-200">
          {currentOption.nativeName}
        </span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-1.5 z-50 w-60 rounded-xl border p-2 shadow-2xl animate-fadeIn ${
            isDark
              ? 'border-slate-700 bg-slate-900 text-slate-100'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
          role="listbox"
        >
          <div className="flex items-center justify-between border-b pb-1.5 mb-1 px-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:border-slate-800">
            <span>{t('language', 'Regional Languages')}</span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-normal lowercase font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ai translate service</span>
            </span>
          </div>

          <div className="space-y-0.5 max-h-72 overflow-y-auto pr-0.5">
            {languages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                    isSelected
                      ? isDark
                        ? 'bg-emerald-950/60 text-emerald-300 font-semibold ring-1 ring-emerald-500/40'
                        : 'bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-600/30'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
                      {item.scriptLabel}
                    </span>
                    <div>
                      <div className="font-bold text-xs leading-none">{item.nativeName}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
