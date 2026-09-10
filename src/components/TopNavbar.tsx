import React from 'react';
import {
  ShieldCheck,
  Download,
  FileText,
  Sparkles,
  ChevronDown,
  FileSpreadsheet,
  Compass,
  ArrowLeft,
  SlidersHorizontal,
} from 'lucide-react';
import { ProfileState } from '../types';
import { PRESET_COMPANY_PROFILES } from '../rules/deterministicEngine';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

interface TopNavbarProps {
  profile: ProfileState;
  onSelectPreset: (presetKey: string) => void;
  onOpenAuditor: () => void;
  onOpenAIDesk: () => void;
  onOpenDossier: () => void;
  onExportCSV?: () => void;
  onStateChange: (stateName: string) => void;
  onOpenWizard?: () => void;
  onGoToLanding?: () => void;
}

const INDIAN_JURISDICTIONS = [
  'Maharashtra (Mumbai / Pune)',
  'Karnataka (Bengaluru)',
  'Delhi-NCR (New Delhi / Gurugram)',
  'Telangana (Hyderabad)',
  'Tamil Nadu (Chennai)',
  'Gujarat (Ahmedabad / GIFT City)',
  'Haryana (Faridabad / Gurugram)',
  'Federal (All India Pan-Jurisdiction)',
];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  profile,
  onSelectPreset,
  onOpenAuditor,
  onOpenAIDesk,
  onOpenDossier,
  onExportCSV,
  onStateChange,
  onOpenWizard,
  onGoToLanding,
}) => {
  const { isDark } = useTheme();
  const { t, founderName } = useApp();

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition ${
      isDark
        ? 'border-slate-800 bg-[#0B0F19]/95 text-slate-100'
        : 'border-slate-200 bg-white/95 text-slate-900 shadow-2xs'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left: Brand Identity & Return to Landing */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xs">
              <span className="font-serif text-lg font-bold tracking-wider text-white">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base font-bold tracking-tight text-blue-900 dark:text-blue-300 sm:text-lg">
                  SBCN
                </span>
                <span className="hidden rounded bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.2 font-mono text-[9px] font-bold text-blue-800 dark:text-blue-300 uppercase sm:inline-block">
                  COMPLIANCE NAVIGATION
                </span>
              </div>
              <p className="hidden text-[10px] text-slate-500 dark:text-slate-400 sm:block">
                {profile.businessName} • {profile.entityType}
              </p>
            </div>
          </div>

          {/* Quick Landing Page Switcher */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className={`hidden md:flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition ${
                isDark
                  ? 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Return to Landing Page"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{t('btnBackToLanding', 'Landing')}</span>
            </button>
          )}
        </div>

        {/* Right: Controls, Wizard, Dark Mode, Lang & CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Reopen Setup Wizard CTA */}
          {onOpenWizard && (
            <button
              id="nav-btn-reopen-wizard"
              onClick={onOpenWizard}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                isDark
                  ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 shadow-2xs'
              }`}
              title="Open Guided Business Setup Wizard"
            >
              <Compass className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{t('btnReopenSetup', 'Setup Guide')}</span>
              <span className="sm:hidden">Setup</span>
            </button>
          )}

          {/* Local Language Selector (Supports 8 Indian Languages with Live Translation Service) */}
          <LanguageSelector compact={false} />

          {/* Dark Mode Toggle */}
          <ThemeToggle showLabel={false} />

          {/* Preset Profile Quick Switcher */}
          <div className="relative hidden xl:block">
            <select
              id="profile-preset-select"
              aria-label="Load Archetype Preset"
              onChange={(e) => onSelectPreset(e.target.value)}
              defaultValue=""
              className={`cursor-pointer appearance-none rounded-lg border py-1.5 pr-7 pl-2.5 text-xs font-medium transition focus:outline-none ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              <option value="" disabled>
                Preset Archetypes...
              </option>
              <option value="early_saas">SaaS & Software (Global)</option>
              <option value="cloud_kitchen">F&B Cloud Kitchen (Mumbai)</option>
              <option value="fintech_payments">Fintech Platform (Bengaluru)</option>
              <option value="light_manufacturing">Light Manufacturing</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-2.5 right-2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* AI Document Auditor */}
          <button
            id="nav-btn-doc-auditor"
            onClick={onOpenAuditor}
            className={`hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            title="Perform AI Consistency Audit on founding documents"
          >
            <FileText className="h-3.5 w-3.5 text-[#5B061E] dark:text-rose-400" />
            <span className="hidden md:inline">{t('btnDocumentAuditor', 'Doc Auditor')}</span>
          </button>

          {/* Aura AI Legal Desk */}
          <button
            id="nav-btn-ai-desk"
            onClick={onOpenAIDesk}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t('btnAIDesk', 'AI Desk')}</span>
          </button>

          {/* Export CSV */}
          {onExportCSV && (
            <button
              id="nav-btn-export-csv"
              onClick={onExportCSV}
              className={`hidden lg:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition active:scale-95 ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
              title="Download Compliance Roadmap as CSV Spreadsheet"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('btnExportCSV', 'CSV')}</span>
            </button>
          )}

          {/* Export Executive Dossier */}
          <button
            id="nav-btn-export-dossier"
            onClick={onOpenDossier}
            className="flex items-center gap-1.5 rounded-lg bg-[#5B061E] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#420415] active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('btnExecutiveDossier', 'Dossier')}</span>
            <span className="sm:hidden">Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
