import React from 'react';
import { ShieldAlert, Clock, IndianRupee, Activity, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ExposureMatrix, ProfileState } from '../types';
import { useApp } from '../context/AppContext';

interface ExposureMatrixHeaderProps {
  matrix: ExposureMatrix;
  profile: ProfileState;
  onJumpToPending: () => void;
}

export const ExposureMatrixHeader: React.FC<ExposureMatrixHeaderProps> = ({
  matrix,
  profile,
  onJumpToPending,
}) => {
  const { t, isDark } = useApp();

  const getBurdenColor = (level: 'Low' | 'Moderate' | 'Critical') => {
    switch (level) {
      case 'Low':
        return {
          bg: 'bg-[#ECFDF5]',
          border: 'border-[#A7F3D0]',
          text: 'text-[#065F46]',
          badge: 'bg-[#10B981] text-white',
          bar: 'bg-[#10B981]',
        };
      case 'Moderate':
        return {
          bg: 'bg-[#FFFBEB]',
          border: 'border-[#FDE68A]',
          text: 'text-[#92400E]',
          badge: 'bg-[#F59E0B] text-white',
          bar: 'bg-[#F59E0B]',
        };
      case 'Critical':
        return {
          bg: 'bg-[#FDF2F4]',
          border: 'border-[#FECDD3]',
          text: 'text-[#9B153B]',
          badge: 'bg-[#5B061E] text-white',
          bar: 'bg-[#5B061E]',
        };
    }
  };

  const burdenStyle = getBurdenColor(matrix.burdenLevel);

  return (
    <section className="mb-6 w-full">
      {/* Container with luxury elevation */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white luxury-shadow transition-all">
        {/* Top subtle status bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#F1F5F9] bg-[#FBFBFA] px-4 py-2 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide text-[#1E1E24] uppercase">
              {t('matrixTitle', 'Omnipresent Exposure Matrix')}
            </span>
            <span className="hidden text-[#9CA3AF] sm:inline">•</span>
            <span className="hidden sm:inline">
              {t('profileLabel', 'Profile:')} <strong className="text-[#374151]">{profile.businessName}</strong> ({profile.entityType})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              {t('statMandatory', 'Mandatory Filings')}: <strong>{matrix.totalApplicable}</strong>
            </span>
            <span>
              {t('statResolved', 'Resolved')}: <strong className="text-[#064E3B]">{matrix.totalResolved}</strong>
            </span>
            {matrix.criticalPendingCount > 0 && (
              <span className="flex items-center gap-1 font-semibold text-[#9B153B]">
                <AlertTriangle className="h-3 w-3" />
                {matrix.criticalPendingCount} {t('statCriticalPending', 'Critical Pending')}
              </span>
            )}
          </div>
        </div>

        {/* 4 Core Quantitative Matrix Gauges */}
        <div className="grid grid-cols-1 divide-y divide-[#F1F5F9] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {/* 1. Compliance Burden Index */}
          <div className="p-4 transition hover:bg-[#FDFBFA]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                {t('statBurdenIndex', 'Burden Index')}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${burdenStyle.badge}`}
              >
                {matrix.burdenLevel}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#1E1E24]">
                {matrix.burdenIndex}
              </span>
              <span className="font-mono text-xs text-[#9CA3AF]">/ 100</span>
            </div>
            {/* Visual Bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className={`h-full transition-all duration-700 ease-out ${burdenStyle.bar}`}
                style={{ width: `${matrix.burdenIndex}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#6B7280]">
              {matrix.burdenLevel === 'Critical'
                ? t('burdenCriticalDesc', 'High statutory inspection & scrutiny density')
                : matrix.burdenLevel === 'Moderate'
                  ? t('burdenModerateDesc', 'Standard statutory filings & baseline registrations')
                  : t('burdenLowDesc', 'Minimal regulatory overhead')}
            </p>
          </div>

          {/* 2. Estimated Setup Days */}
          <div className="p-4 transition hover:bg-[#FDFBFA]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                {t('statTimeline', 'Timeline to Open')}
              </span>
              <span className="flex items-center gap-1 rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-medium text-[#475569]">
                <Clock className="h-3 w-3" />
                {t('criticalPath', 'Critical Path')}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#1E1E24]">
                {matrix.setupDays}
              </span>
              <span className="text-xs font-medium text-[#6B7280]">{t('statBusinessDays', 'Business Days')}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#475569]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5B061E]"></span>
              <span>Phase 1 (2–5d) + Operational (10–25d)</span>
            </div>
            <p className="mt-1.5 text-[11px] text-[#6B7280]">
              {t('statFastTracked', 'Fast-tracked via simultaneous portal submissions')}
            </p>
          </div>

          {/* 3. Minimum Statutory Budget */}
          <div className="p-4 transition hover:bg-[#FDFBFA]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                {t('statGovtBudget', 'Statutory Budget')}
              </span>
              <span className="rounded bg-[#FDF2F4] px-1.5 py-0.5 text-[10px] font-semibold text-[#5B061E]">
                ₹ {t('estimated', 'Estimated')}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-sans text-sm font-semibold text-[#5B061E]">₹</span>
              <span className="font-serif text-3xl font-bold tracking-tight text-[#1E1E24]">
                {matrix.totalBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-[#475569]">
              <span>
                {t('govtFees', 'Govt Fees')}: <strong>₹{matrix.minGovtFee.toLocaleString('en-IN')}</strong>
              </span>
              <span>
                {t('legalCa', 'Legal/CA')}: <strong>₹{matrix.minProfessionalFee.toLocaleString('en-IN')}</strong>
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-[#6B7280]">
              {t('baselineOutlayDesc', 'Baseline official stamp duty, ROC, & filing fees')}
            </p>
          </div>

          {/* 4. Compliance Health Score */}
          <div className="p-4 transition hover:bg-[#FDFBFA]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                {t('statHealthScore', 'Compliance Health')}
              </span>
              <button
                onClick={onJumpToPending}
                className="flex items-center gap-0.5 text-[11px] font-semibold text-[#064E3B] hover:underline"
              >
                <span>{t('viewPending', 'View Pending')}</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`font-serif text-3xl font-bold tracking-tight ${
                  matrix.healthScore >= 80
                    ? 'text-[#064E3B]'
                    : matrix.healthScore >= 50
                      ? 'text-[#B45309]'
                      : 'text-[#9B153B]'
                }`}
              >
                {matrix.healthScore}%
              </span>
              <span className="text-xs text-[#6B7280]">
                ({matrix.totalResolved}/{matrix.totalApplicable} {t('done', 'done')})
              </span>
            </div>
            {/* Progress gauge */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full bg-[#064E3B] transition-all duration-500 ease-out"
                style={{ width: `${matrix.healthScore}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#6B7280]">
              {matrix.healthScore === 100
                ? t('health100', 'All statutory gates cleared for operations')
                : `${matrix.totalApplicable - matrix.totalResolved} actions remaining to reach 100%`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
