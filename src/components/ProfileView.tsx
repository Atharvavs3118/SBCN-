import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  ShieldCheck,
  MapPin,
  FileCheck2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Award,
  Users,
  Briefcase,
  Upload,
} from 'lucide-react';
import { ProfileState } from '../types';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface ProfileViewProps {
  profile: ProfileState;
  onProfileChange: (updated: Partial<ProfileState>) => void;
  onBackToChecklist: () => void;
  onGoToDashboard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onProfileChange,
  onBackToChecklist,
  onGoToDashboard,
}) => {
  const { isDark } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [city, setCity] = useState(profile.city);

  const handleSave = () => {
    onProfileChange({
      businessName,
      city,
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#080D1A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition py-3.5 px-4 sm:px-8 flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-[#080D1A]/90' : 'border-slate-200 bg-white/95 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChecklist}
            className={`p-2 rounded-lg border transition ${
              isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Enterprise Profile & Statutory Dossier
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {profile.businessName} • {profile.entityType}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onGoToDashboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <LanguageSelector compact />
          <ThemeToggle showLabel={false} />
        </div>
      </header>

      {/* Main Profile Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Profile Card */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 shadow-xs ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  className="h-20 w-20 object-contain rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-sm"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                  {profile.businessName.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {profile.businessName}
                  </h1>
                  {profile.gstVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>AI Verified GSTIN</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-blue-500" />
                    <span>{profile.entityType}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{profile.sector}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    <span>
                      {profile.city ? `${profile.city}, ` : ''}
                      {profile.state}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-200'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Edit Information
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Goods & Services Tax (GSTIN)
              </div>
              <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {profile.gstNumber || 'Pending Checkpoint 4'}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {profile.gstVerified ? 'Statutory Active Match' : 'Awaiting real-time verification'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Team Headcount
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {profile.exactHeadcount} Personnel ({profile.headcountTier})
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                EPFO & ESIC social security mapped
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Revenue Threshold
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {profile.revenueThreshold}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                GST threshold & audit tier
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Operating Premise
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {profile.footprint}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Municipal Shop Act mapped
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Cross-Border Activity
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {profile.crossBorder}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                LUT RFD-11 / IEC compliance
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Uploaded Statutory Certificate
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                {profile.uploadedCertificateName || 'None Uploaded'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Audited via Gemini 3.8
              </div>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={onBackToChecklist}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Checklist Checkpoints</span>
            </button>

            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
            >
              <span>Go to Compliance Roadmap Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
