import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  Scale,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSetup: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartSetup,
}) => {
  const { isDark, t } = useApp();

  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: t('hiwStep1Title', '1. Venture Profiling & Legal Identity'),
      desc: t('hiwStep1Desc', 'Define your business model, founders, entity type (Pvt Ltd, LLP, OPC), location, and operational footprint.'),
      details: [
        'Sector-specific statutory mapping (SaaS, E-comm, F&B, Healthcare, Fintech)',
        'Legal entity comparison (Pvt Ltd liability shield vs LLP flexibility)',
        'Foreign capital & NRI director verification (FDI, FEMA, RBI compliance)',
      ],
      icon: Building2,
      accent: 'emerald',
    },
    {
      num: '02',
      title: t('hiwStep2Title', '2. Deterministic Statutory Mapping'),
      desc: t('hiwStep2Desc', 'The legal engine cross-checks 40+ Central and State statutes (MCA, GST, EPFO, ESIC, DPDP, FEMA) without arbitrary hallucinations.'),
      details: [
        'Ministry of Corporate Affairs (MCA SPICe+, DIN, Name RUN, INC-20A)',
        'Indirect Taxes (GST threshold ₹20L/₹40L & LUT RFD-11 for zero-rated SaaS export)',
        'Labour Codes (EPFO 20+ headcount, ESIC 10+ wage ceiling, POSH IC for 10+ staff)',
      ],
      icon: Scale,
      accent: 'maroon',
    },
    {
      num: '03',
      title: t('hiwStep3Title', '3. Real-Time Exposure Matrix'),
      desc: t('hiwStep3Desc', 'Calculate statutory government fees, clearance timelines, penalty vulnerabilities, and director liability exposures instantly.'),
      details: [
        'Precise mathematical late fee calculators (₹50/day GST, ₹100/day ROC filings)',
        'Director disqualification & strike-off risk mitigation',
        'State-specific municipal Shop & Establishment and Professional Tax timelines',
      ],
      icon: AlertTriangle,
      accent: 'amber',
    },
    {
      num: '04',
      title: t('hiwStep4Title', '4. AI Document Auditor & Filing Desk'),
      desc: t('hiwStep4Desc', 'Scrutinize founding documents, board resolutions, and lease deeds while tracking filings with downloadable CSV spreadsheets.'),
      details: [
        'Instant AI scrutiny for address mismatches and missing statutory covenants',
        'Offline Excel/CSV exports formatted for legal counsel and accounting teams',
        'Live regulatory counsel answering complex procedural questions 24/7',
      ],
      icon: Sparkles,
      accent: 'blue',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border p-6 shadow-2xl transition ${
          isDark
            ? 'border-slate-700 bg-slate-900 text-slate-100'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t('hiwTitle', 'How SBCN Guides Your Business Setup')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('hiwSubtitle', 'A deterministic 4-stage engine that eliminates legal guesswork for startup founders and business owners.')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className={`rounded-xl border p-4 transition ${
                  isDark
                    ? 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                      {step.num}
                    </span>
                    <span className="font-semibold text-sm">{step.title}</span>
                  </div>
                  <IconComponent className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {step.desc}
                </p>
                <div className="space-y-1.5 border-t pt-2.5 dark:border-slate-700/60">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Box */}
        <div className={`mt-6 rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? 'border-emerald-900/50 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/60'
        }`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Deterministic Legal Precision
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Statutory acts, official portal links (MCA, GST, EPFO, Shram Suvidha), and penalty caps are verified against gazetted Indian notifications.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t pt-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className={`w-full sm:w-auto rounded-lg border px-4 py-2 text-xs font-medium transition ${
              isDark
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t('hiwClose', 'Close Overview')}
          </button>
          <button
            onClick={() => {
              onClose();
              onStartSetup();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-emerald-800 active:scale-95"
          >
            <span>{t('hiwStartNow', 'Start My Business Setup Now')}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
