import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Compass,
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  Scale,
  Sparkles,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  ChevronRight,
  Clock,
  IndianRupee,
  Users,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { HowItWorksModal } from './HowItWorksModal';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const { isDark, t } = useApp();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Any button on landing page other than 'How It Works' redirects to login page
  const handleOtherButtonClick = () => {
    onGoToLogin();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#FBFBFA] text-[#1E1E24]'}`}>
      {/* 1. Header Navigation */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition ${
        isDark ? 'border-slate-800/80 bg-[#0B0F19]/90' : 'border-slate-200/80 bg-white/90 shadow-2xs'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo & Name: SBCN */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  SBCN
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
                {t('tagline', 'Smart Business Compliance Navigation')}
              </p>
            </div>
          </div>

          {/* Controls: Language, Theme, How It Works, Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Local Language Dropdown */}
            <LanguageSelector />

            {/* Dark Mode Toggle */}
            <ThemeToggle showLabel={false} />

            {/* How It Works Button */}
            <button
              id="landing-btn-how-it-works"
              onClick={() => setIsHowItWorksOpen(true)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                isDark
                  ? 'border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('btnHowItWorks', 'How It Works')}</span>
            </button>

            {/* Sign In CTA */}
            <button
              id="landing-btn-signin"
              onClick={handleOtherButtonClick}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isDark ? 'border-slate-700 text-slate-200' : 'border-slate-300 text-slate-700'
              }`}
            >
              {t('btnSignIn', 'Sign In')}
            </button>

            {/* Get Started CTA */}
            <button
              id="landing-btn-getstarted-nav"
              onClick={handleOtherButtonClick}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
            >
              <span>{t('btnGetStarted', 'Get Started')}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle decorative background ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
          <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-blue-400/20 via-sky-500/10 to-indigo-300/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t('heroBadge', 'Zero-Penalty Business Setup & Regulatory Engine')}</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-slate-50 leading-[1.15]">
            {t('heroTitle', 'Build, Register & Scale Your Business Without Regulatory Roadblocks')}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('heroSubtitle', 'From private limited incorporation and legal structure to GST, EPFO, and statutory filings — navigate obligations with clarity and speed.')}
          </p>

          {/* Main Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Start Business Setup -> Redirects to Login */}
            <button
              id="landing-btn-start-setup"
              onClick={handleOtherButtonClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
            >
              <span>{t('btnStartBusinessSetup', 'Start Business Setup Guide')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* How It Works Button -> Opens Modal */}
            <button
              id="landing-btn-how-it-works-hero"
              onClick={() => setIsHowItWorksOpen(true)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition active:scale-95 ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{t('btnHowItWorks', 'How It Works')}</span>
            </button>

            {/* Launch Navigator -> Redirects to Login */}
            <button
              id="landing-btn-launch-navigator"
              onClick={handleOtherButtonClick}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition ${
                isDark
                  ? 'border-blue-900/50 bg-blue-950/20 text-blue-300 hover:bg-blue-950/40'
                  : 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100'
              }`}
            >
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{t('btnLaunchNavigator', 'Explore Demo')}</span>
            </button>
          </div>

          {/* Stat highlights ticker */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <div className={`rounded-xl border p-3.5 text-center transition ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-2xs'
            }`}>
              <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                40+
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Central & State Acts Mapped
              </div>
            </div>

            <div className={`rounded-xl border p-3.5 text-center transition ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-2xs'
            }`}>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                ₹0
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Late Penalty Guarantee
              </div>
            </div>

            <div className={`rounded-xl border p-3.5 text-center transition ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-2xs'
            }`}>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                18–24
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Days Average Clearance
              </div>
            </div>

            <div className={`rounded-xl border p-3.5 text-center transition ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-2xs'
            }`}>
              <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                100%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Audit Trail & CSV Export
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Core Pillars Cards */}
      <section className={`border-t py-16 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              A Complete Platform for Corporate Compliance
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Guided intelligence that protects founders, automates statutory timelines, and keeps your company in full standing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 transition ${
                isDark ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-4">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Entity & Structure Guide
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Compare Private Limited, LLP, One Person Company, and Sole Proprietorship with liability shields, investor readiness, and secretarial requirements.
              </p>
              <button
                onClick={handleOtherButtonClick}
                className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Select Company Structure</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 transition ${
                isDark ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deadline & Penalty Tracking
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track statutory daily accrued penalties and monitor director compliance obligations in real-time.
              </p>
              <button
                onClick={handleOtherButtonClick}
                className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <span>Calculate Legal Exposure</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 transition ${
                isDark ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Document & Filing Verification
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Audit lease deeds, utility bills, and director resolutions before filing to eliminate rejection errors.
              </p>
              <button
                onClick={handleOtherButtonClick}
                className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Audit Statutory Documents</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Founder Call-to-Action Bar */}
      <section className="py-12 border-t dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h3 className="text-xl sm:text-2xl font-bold">
            Ready to Build and Register Your Enterprise?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join founders streamlining company setup, GST, and statutory governance.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              id="landing-footer-start-setup"
              onClick={handleOtherButtonClick}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              <span>{t('btnStartBusinessSetup', 'Start Business Setup Guide')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              id="landing-footer-how-it-works"
              onClick={() => setIsHowItWorksOpen(true)}
              className={`flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-xs font-medium transition ${
                isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>{t('btnHowItWorks', 'How It Works')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartSetup={handleOtherButtonClick}
      />
    </div>
  );
};
