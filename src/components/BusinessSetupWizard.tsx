import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Scale,
  Users,
  MapPin,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Globe,
  IndianRupee,
  Info,
} from 'lucide-react';
import {
  ProfileState,
  EntityStructure,
  OperationalSector,
  HeadcountTier,
  RevenueThreshold,
  FootprintType,
  CrossBorderMode,
} from '../types';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface BusinessSetupWizardProps {
  initialProfile: ProfileState;
  onComplete: (profile: ProfileState) => void;
  onSkip: () => void;
}

const INDIAN_STATES = [
  'Karnataka (Bengaluru)',
  'Maharashtra (Mumbai/Pune)',
  'Delhi-NCR',
  'Tamil Nadu (Chennai)',
  'Telangana (Hyderabad)',
  'Gujarat (Ahmedabad/GIFT City)',
  'Uttar Pradesh (Noida/Lucknow)',
  'Kerala (Kochi/Trivandrum)',
  'West Bengal (Kolkata)',
  'Haryana (Gurugram)',
];

export const BusinessSetupWizard: React.FC<BusinessSetupWizardProps> = ({
  initialProfile,
  onComplete,
  onSkip,
}) => {
  const { isDark, t } = useApp();

  // Wizard answers state
  const [formData, setFormData] = useState<ProfileState>({
    ...initialProfile,
    incorporationStatus: 'Pre-Incorporation / Planning',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const updateForm = (fields: Partial<ProfileState>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Step names
  const stepTitles = [
    t('step1Name', 'Business Idea & Sector'),
    t('step2Name', 'Legal Entity Structure'),
    t('step3Name', 'Founders & Investment'),
    t('step4Name', 'Location & Operations'),
    t('step5Name', 'Team & Headcount'),
    t('step6Name', 'Revenue & Cross-Border'),
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#FBFBFA] text-[#1E1E24]'
    }`}>
      {/* Top Header */}
      <header className={`border-b py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md transition ${
        isDark ? 'border-slate-800 bg-[#0B0F19]/90' : 'border-slate-200 bg-white/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              SBCN
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('wizardTitle', 'Smart Business Compliance Navigation')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSkip}
            className={`text-xs font-medium px-2.5 py-1 rounded-md transition ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('btnSkipToDashboard', 'Skip to Dashboard')}
          </button>
          <LanguageSelector compact />
          <ThemeToggle showLabel={false} />
        </div>
      </header>

      {/* Progress Bar & Step Tracker */}
      <div className={`border-b py-3 px-4 sm:px-8 ${isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-emerald-600 dark:text-emerald-400">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {Math.round((currentStep / totalSteps) * 100)}% Completed
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Questionnaire Canvas */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 my-4">
        <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl transition ${
          isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* STEP 1: BUSINESS IDEA & SECTOR */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Step 1: The Venture Foundation</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t('qBusinessName', 'What is your Business or Startup Name?')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your tentative corporate brand. This will anchor your MCA name reservation (RUN) and trademark checks.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Business / Company Name
                  </label>
                  {initialProfile?.businessName && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Existing Registered Entity
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateForm({ businessName: e.target.value })}
                  placeholder="e.g. Acme Innovations"
                  className={`w-full rounded-xl border p-3 text-sm font-semibold transition focus:outline-none ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-white focus:border-blue-500'
                      : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-600'
                  }`}
                />
                {initialProfile?.businessName && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                    <span>Active entity loaded. You can proceed with this company or edit if renaming.</span>
                    <button
                      type="button"
                      onClick={onSkip}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Skip to Checklist →
                    </button>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  {t('qSector', 'What industry or sector does your business operate in?')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      { id: 'SaaS & Cloud Software', label: 'Tech & SaaS Software', sub: 'Zero-rated export, LUT RFD-11, DPDP compliance' },
                      { id: 'Retail & E-Commerce', label: 'E-Commerce & D2C', sub: 'GST TCS, packaging rules, consumer protection' },
                      { id: 'F&B / Hospitality', label: 'Food & Beverage / Cloud Kitchen', sub: 'Mandatory FSSAI license, municipal health trade' },
                      { id: 'Healthcare & Diagnostics', label: 'Healthcare & Diagnostics', sub: 'Clinical establishment, bio-medical waste' },
                      { id: 'Light Manufacturing', label: 'Manufacturing & Hardware', sub: 'Pollution Control CTE/CTO, Factory Act' },
                      { id: 'Fintech / NBFC', label: 'Fintech & Financial Services', sub: 'RBI PA/PG guidelines, high regulatory rigor' },
                    ] as const
                  ).map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => updateForm({ sector: sec.id as OperationalSector })}
                      className={`rounded-xl border p-3 text-left transition ${
                        formData.sector === sec.id
                          ? isDark
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : isDark
                          ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-xs flex items-center justify-between">
                        <span>{sec.label}</span>
                        {formData.sector === sec.id && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sec.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LEGAL IDENTITY & ENTITY SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <Scale className="h-3.5 w-3.5" />
                  <span>Step 2: Legal Identity & Company Structure</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t('qEntityType', 'Which legal company structure do you plan to establish?')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your legal identity dictates equity issuance, liability shields, tax rates, and filing complexity under Indian company law.
                </p>
              </div>

              <div className="space-y-3">
                {(
                  [
                    {
                      id: 'Private Limited',
                      name: 'Private Limited Company (Pvt Ltd)',
                      badge: 'Recommended for Startups & VC Funding',
                      badgeColor: 'emerald',
                      features: ['Complete Limited Liability Shield', 'Ready for Angel/VC Investors & ESOPs', 'Requires 2+ Directors & Statutory Audit', 'SPICe+ Part A & B incorporation'],
                    },
                    {
                      id: 'Limited Liability Partnership (LLP)',
                      name: 'Limited Liability Partnership (LLP)',
                      badge: 'Best for Consultancies & Bootstrapped Firms',
                      badgeColor: 'blue',
                      features: ['Partners have limited liability', 'No mandatory dividend distribution tax', 'Low annual MCA compliance load', 'Cannot issue equity stock or ESOPs easily'],
                    },
                    {
                      id: 'One Person Company (OPC)',
                      name: 'One Person Company (OPC)',
                      badge: 'Ideal for Solo Entrepreneurs',
                      badgeColor: 'amber',
                      features: ['Single founder corporate structure', 'Limited personal liability', 'Requires nominee director declaration', 'Converts to Pvt Ltd if turnover crosses threshold'],
                    },
                    {
                      id: 'Sole Proprietorship',
                      name: 'Sole Proprietorship',
                      badge: 'Fastest Local Setup (Unlimited Liability)',
                      badgeColor: 'rose',
                      features: ['No MCA incorporation fees', 'Unlimited personal legal liability', 'Registered via GST & Shop Act', 'Cannot raise external investment'],
                    },
                  ] as const
                ).map((ent) => {
                  const isSelected = formData.entityType === ent.id;
                  return (
                    <div
                      key={ent.id}
                      onClick={() => updateForm({ entityType: ent.id as EntityStructure })}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        isSelected
                          ? isDark
                            ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                            : 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                          : isDark
                          ? 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {ent.name}
                            </h3>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                              {ent.badge}
                            </span>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                      </div>

                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                        {ent.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Legal Tip */}
              <div className={`rounded-xl border p-3 text-xs flex items-start gap-2.5 ${
                isDark ? 'border-blue-900/60 bg-blue-950/20 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-900'
              }`}>
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-bold">Legal Counsel Recommendation: </span>
                  {formData.sector === 'SaaS & Cloud Software' || formData.takesForeignCapital
                    ? 'Since you operate in tech or plan to take external capital, a Private Limited Company is the global industry standard for equity vesting and venture investment.'
                    : 'A Private Limited Company offers the strongest liability shield, while an LLP minimizes administrative secretarial costs.'}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FOUNDERS, OWNERSHIP & CAPITAL (ADAPTIVE TO ENTITY TYPE) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Step 3: Ownership & Capitalization ({formData.entityType})</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formData.entityType === 'Sole Proprietorship'
                    ? 'Proprietor Identification & Individual PAN/Aadhaar Setup'
                    : formData.entityType === 'One Person Company (OPC)'
                    ? 'Single Director & Nominee Consent (Form INC-3)'
                    : formData.entityType === 'Limited Liability Partnership (LLP)'
                    ? 'Designated Partners & LLP Capital Contribution'
                    : t('qFounders', 'How many founding members or directors are on the cap table?')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formData.entityType === 'Sole Proprietorship'
                    ? 'Sole Proprietorship operates under the individual proprietor PAN and does not require MCA DIN or DSC filings.'
                    : formData.entityType === 'Limited Liability Partnership (LLP)'
                    ? 'Governs Designated Partner Identification Numbers (DPIN) and partner profit-sharing ratios in the LLP Agreement.'
                    : 'Governs Digital Signature Certificates (DSC Class 3), DIN allocations, and SPICe+ MoA subscriber share capital.'}
                </p>
              </div>

              {/* Entity Specific Notice */}
              <div className={`rounded-xl border p-3.5 text-xs flex items-start gap-2.5 ${
                isDark ? 'border-blue-900/60 bg-blue-950/20 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-900'
              }`}>
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-bold">Structure Mapping: </span>
                  {formData.entityType === 'Sole Proprietorship' &&
                    'Since you chose Sole Proprietorship, you will be registered directly via GST, MSME Udyam, and Municipal Shop Act using your personal PAN and Aadhaar.'}
                  {formData.entityType === 'One Person Company (OPC)' &&
                    'OPC requires 1 shareholder/director plus 1 nominee director who takes over in event of death/incapacity (Form INC-3 consent required).'}
                  {formData.entityType === 'Limited Liability Partnership (LLP)' &&
                    'LLP requires at least 2 Designated Partners, of which at least one must be an Indian resident. LLP Agreement must be executed on state stamp paper within 30 days.'}
                  {formData.entityType === 'Private Limited' &&
                    'Pvt Ltd requires minimum 2 directors and 2 shareholders (can be the same persons), with at least one Indian resident director.'}
                </div>
              </div>

              {/* Foreign Investment Toggle (Hidden for Sole Proprietorship as FDI is restricted under FEMA) */}
              {formData.entityType !== 'Sole Proprietorship' && (
                <div className={`rounded-xl border p-4 ${
                  isDark ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {t('qForeignCapital', 'Will you receive Foreign Investment (FDI / NRI / Overseas VC)?')}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Triggers Reserve Bank of India (RBI) FIRMS portal reporting & Form FC-GPR within 30 days of share allotment.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateForm({ takesForeignCapital: !formData.takesForeignCapital })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.takesForeignCapital ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.takesForeignCapital ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Startup India DPIIT Recognition */}
              <div className={`rounded-xl border p-4 ${
                isDark ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Startup India (DPIIT) Recognition & Tax Exemption Intent
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Access 3-year income tax holiday (Section 80-IAC) and 80% rebate on statutory patent/trademark filing fees.
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    Included in Roadmap
                  </span>
                </div>
              </div>

              {/* Customer Personal Data Handling */}
              <div className={`rounded-xl border p-4 ${
                isDark ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('qDataPrivacy', 'Will your application collect or process personal customer digital data?')}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Enforces Digital Personal Data Protection (DPDP) Act 2023 compliance, data fiduciary notices, and consent managers.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateForm({ handlingCustomerPersonalData: !formData.handlingCustomerPersonalData })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.handlingCustomerPersonalData ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.handlingCustomerPersonalData ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LOCATION & OPERATIONS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Step 4: Location & Operating Footprint</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t('qState', 'Which Indian State will serve as your primary registered office?')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Governs state stamp duty rates, ROC jurisdiction, municipal Shop & Establishment licenses, and Professional Tax.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                    Primary State & Technology Hub
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateForm({ state: e.target.value })}
                    className={`w-full rounded-xl border p-3 text-xs font-semibold transition focus:outline-none ${
                      isDark
                        ? 'border-slate-700 bg-slate-800 text-white focus:border-blue-500'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-600'
                    }`}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                    City / Municipality Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => updateForm({ city: e.target.value })}
                    placeholder="e.g. Bengaluru, Mumbai, Gurugram, Pune"
                    className={`w-full rounded-xl border p-2.5 text-xs font-semibold transition focus:outline-none ${
                      isDark
                        ? 'border-slate-700 bg-slate-800 text-white focus:border-blue-500'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    Affects exact municipal Health Trade License fees and Fire NOC jurisdiction.
                  </div>
                </div>
              </div>

              {/* Jurisdiction Tier: Metro vs Small City vs Gram Panchayat */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Local Administrative Body / Jurisdiction Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        tier: 'Tier-1 Metro / Municipal Corporation',
                        title: 'Tier-1 Metro City',
                        desc: 'Municipal Corporation (BMC, BBMP, MCD, GHMC)',
                        badge: 'Urban Corporation',
                      },
                      {
                        tier: 'Small City / Municipality (Nagar Palika)',
                        title: 'Small City / Town',
                        desc: 'Municipality / Nagar Palika / Town Council',
                        badge: 'Nagar Palika',
                      },
                      {
                        tier: 'Rural / Gram Panchayat',
                        title: 'Rural / Gram Panchayat',
                        desc: 'Village Panchayat (Panchayati Raj Act)',
                        badge: 'Gram Panchayat',
                      },
                    ] as const
                  ).map((item) => {
                    const isSelected = (formData.locationTier || 'Tier-1 Metro / Municipal Corporation') === item.tier;
                    return (
                      <button
                        key={item.tier}
                        type="button"
                        onClick={() => updateForm({ locationTier: item.tier as any })}
                        className={`rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? isDark
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                              : 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                            : isDark
                            ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-xs mb-1">
                          <span>{item.title}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                          {item.desc}
                        </p>
                        <span className="mt-2 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Gram Panchayat or Small City input */}
              {formData.locationTier === 'Rural / Gram Panchayat' && (
                <div className={`rounded-xl border p-3.5 space-y-2 ${
                  isDark ? 'border-amber-900/60 bg-amber-950/20 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold">Gram Panchayat (Panchayati Raj Act) Details</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Gram Panchayat / Village Name
                    </label>
                    <input
                      type="text"
                      value={formData.gramPanchayatName || ''}
                      onChange={(e) => updateForm({ gramPanchayatName: e.target.value })}
                      placeholder="e.g. Gram Panchayat Khed, Pune District"
                      className={`w-full rounded-xl border p-2.5 text-xs font-semibold transition focus:outline-none ${
                        isDark
                          ? 'border-slate-700 bg-slate-800 text-white focus:border-amber-500'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-amber-600'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-90">
                    💡 <strong>Statutory Exemption Notice:</strong> Commercial businesses in Gram Panchayat jurisdictions are governed by the State Panchayati Raj Act. They obtain a Gram Panchayat Trade NOC / Parwana instead of urban Municipal Corporation licenses, and are eligible for small business & rural enterprise fee waivers.
                  </p>
                </div>
              )}

              {formData.locationTier === 'Small City / Municipality (Nagar Palika)' && (
                <div className={`rounded-xl border p-3.5 space-y-2 ${
                  isDark ? 'border-blue-900/60 bg-blue-950/20 text-blue-200' : 'border-blue-200 bg-blue-50 text-blue-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold">Small City Municipality (Nagar Palika / Parishad)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Municipality / Nagar Palika Name
                    </label>
                    <input
                      type="text"
                      value={formData.localBodyName || ''}
                      onChange={(e) => updateForm({ localBodyName: e.target.value })}
                      placeholder="e.g. Alwar Nagar Parishad, Kolhapur Nagar Palika"
                      className={`w-full rounded-xl border p-2.5 text-xs font-semibold transition focus:outline-none ${
                        isDark
                          ? 'border-slate-700 bg-slate-800 text-white focus:border-blue-500'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-90">
                    💡 <strong>Simplified Licensing:</strong> Small city businesses enjoy streamlined municipal shop act clearances and lower statutory local cess compared to Tier-1 metropolitan corporations.
                  </p>
                </div>
              )}

              {/* Online Delivery Activity */}
              <div className={`rounded-xl border p-4 transition ${
                formData.hasOnlineDelivery
                  ? isDark
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-emerald-600/50 bg-emerald-50/50'
                  : isDark
                  ? 'border-slate-800 bg-slate-800/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Online Delivery Activity</span>
                      <span className="rounded bg-blue-100 dark:bg-blue-950 px-1.5 py-0.2 text-[10px] text-blue-700 dark:text-blue-300 font-semibold">
                        Statutory Trigger
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Does your business deliver products, food, or services to customer doorsteps via apps or online platforms?
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !formData.hasOnlineDelivery;
                      updateForm({
                        hasOnlineDelivery: nextVal,
                        onlineDeliveryModel: nextVal
                          ? (formData.sector === 'F&B / Hospitality'
                              ? 'Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)'
                              : 'E-Commerce Marketplace (Amazon / Flipkart / Meesho)')
                          : 'None',
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.hasOnlineDelivery ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.hasOnlineDelivery ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {formData.hasOnlineDelivery && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Primary Delivery Fulfillment Model
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)',
                          label: 'Food / QSR Aggregators',
                          sub: 'Swiggy, Zomato, Blinkit, Zepto',
                        },
                        {
                          id: 'E-Commerce Marketplace (Amazon / Flipkart / Meesho)',
                          label: 'E-Commerce Marketplaces',
                          sub: 'Amazon, Flipkart, Meesho, Myntra',
                        },
                        {
                          id: 'Direct Delivery (Own Fleet / D2C)',
                          label: 'Direct Delivery / Own Fleet',
                          sub: 'In-house drivers or D2C website',
                        },
                      ].map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => updateForm({ onlineDeliveryModel: mod.id as any })}
                          className={`p-2.5 rounded-lg border text-left transition ${
                            formData.onlineDeliveryModel === mod.id
                              ? isDark
                                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                                : 'border-emerald-600 bg-emerald-100/60 text-emerald-900 font-semibold'
                              : isDark
                              ? 'border-slate-800 bg-slate-800/60 text-slate-300'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">{mod.label}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{mod.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  {t('qFootprint', 'What is your physical operating model?')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        id: 'Remote / Virtual Office',
                        title: 'Remote / Virtual Office',
                        desc: 'Founders work distributed; registered address via virtual coworking space with Landlord NOC & utility bill.',
                      },
                      {
                        id: 'Physical Commercial Premise',
                        title: 'Physical Commercial Premise',
                        desc: 'Dedicated commercial office, retail shop, or factory with physical signage board and municipal lease deed.',
                      },
                    ] as const
                  ).map((foot) => (
                    <button
                      key={foot.id}
                      type="button"
                      onClick={() => updateForm({ footprint: foot.id as FootprintType })}
                      className={`rounded-xl border p-3.5 text-left transition ${
                        formData.footprint === foot.id
                          ? isDark
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : isDark
                          ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-xs flex items-center justify-between">
                        <span>{foot.title}</span>
                        {formData.footprint === foot.id && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{foot.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adaptive Industry-Specific Operational Approvals based on selected Sector */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Sector-Specific Regulatory Approvals ({formData.sector})
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Adaptive Filter
                  </span>
                </div>

                {/* 1. Manufacturing & Hardware: ONLY Factory Act, Pollution Control CTE/CTO, Heavy Power */}
                {formData.sector === 'Light Manufacturing' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Industrial Effluents, Emissions, or Chemical By-Products?
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandatory State Pollution Control Board Consent to Establish (CTE) & Consent to Operate (CTO) under Air/Water Acts.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.handlingEffluentOrPollution}
                        onChange={(e) => updateForm({ handlingEffluentOrPollution: e.target.checked, handlingFood: false })}
                        className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Industrial Machinery / Heavy Connected Power Load (&gt;10 HP)?
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Requires Factory License under Factories Act 1948 and state electrical inspectorate safety clearance.
                        </div>
                      </div>
                      <span className="rounded-md bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        Factories Act 1948
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Food & Beverage / Hospitality: ONLY FSSAI, Commercial Kitchen, Health Trade */}
                {formData.sector === 'F&B / Hospitality' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          FSSAI Food Safety Licensing Tier
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandatory under Food Safety and Standards Act 2006 before commencing culinary operations.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.handlingFood}
                        onChange={(e) => updateForm({ handlingFood: e.target.checked, handlingEffluentOrPollution: false })}
                        className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                      <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                        Culinary Gateway Roadmap:
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                        Turnover &lt; ₹12L requires FSSAI Basic Registration. ₹12L to ₹20 Cr requires State FSSAI License. Municipal Health Trade License will be mapped automatically to your selected city ({formData.city || formData.state}).
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SaaS & Cloud Software: ONLY Software Export, LUT RFD-11, DPDP Act */}
                {formData.sector === 'SaaS & Cloud Software' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Export of Software Services & Overseas Invoicing (0% Zero-Rated)?
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Enables GST Letter of Undertaking (LUT RFD-11) to bill US/EU clients with 0% GST without paying output IGST.
                        </div>
                      </div>
                      <span className="rounded-md bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                        LUT RFD-11
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Digital Personal Data Protection (DPDP) Act 2023 Compliance
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandates user consent notices, privacy policy disclosures, and Data Fiduciary data breach protocols.
                        </div>
                      </div>
                      <span className="rounded-md bg-purple-100 dark:bg-purple-950 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:text-purple-300">
                        DPDP Act 2023
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Retail & E-Commerce: ONLY GST TCS, Legal Metrology Packaging, Marketplace Rules */}
                {formData.sector === 'Retail & E-Commerce' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Legal Metrology (LMPC) Packaged Commodities Rules 2011
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandatory packaging declarations (MRP, manufacturing date, importer name, consumer care address).
                        </div>
                      </div>
                      <span className="rounded-md bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                        LMPC Act
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          GST Tax Collected at Source (TCS) Section 52
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Registration required for reconciliation with Amazon, Flipkart, or D2C payment gateway withholding.
                        </div>
                      </div>
                      <span className="rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        GST TCS Sec 52
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. Healthcare & Diagnostics: Clinical Establishments & Bio-Medical Waste */}
                {formData.sector === 'Healthcare & Diagnostics' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Clinical Establishments Registration & Biomedical Waste Authorization
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandatory under Clinical Establishments Act and Bio-Medical Waste Management Rules 2016.
                        </div>
                      </div>
                      <span className="rounded-md bg-rose-100 dark:bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-300">
                        Health Dept & SPCB
                      </span>
                    </div>
                  </div>
                )}

                {/* 6. Fintech / NBFC: RBI Regulatory Compliance & PA/PG Guidelines */}
                {formData.sector === 'Fintech / NBFC' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          RBI Payment Aggregator / Payment Gateway (PA/PG) & CERT-In Audit
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandatory compliance with Reserve Bank of India net-worth guidelines and data localization directives.
                        </div>
                      </div>
                      <span className="rounded-md bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        RBI Guidelines
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: TEAM & HEADCOUNT */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Step 5: Team Size & Payroll Compliance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t('qHeadcount', 'What is your projected initial team headcount?')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Headcount triggers mandatory statutory registrations including ESIC, EPFO, Professional Tax, and POSH Internal Committee.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Select Team Size Bracket
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { tier: '1–9', label: '1 to 9 Staff', count: 4, badge: 'Core Founders' },
                      { tier: '10–19', label: '10 to 19 Staff', count: 14, badge: 'ESIC + POSH' },
                      { tier: '20–49', label: '20 to 49 Staff', count: 28, badge: 'EPFO Mandatory' },
                      { tier: '50+', label: '50+ Staff', count: 65, badge: 'Full Enterprise' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.tier}
                      type="button"
                      onClick={() =>
                        updateForm({
                          headcountTier: item.tier as HeadcountTier,
                          exactHeadcount: item.count,
                        })
                      }
                      className={`rounded-xl border p-3 text-center transition ${
                        formData.headcountTier === item.tier
                          ? isDark
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : isDark
                          ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className="text-[10px] mt-1 text-slate-500 dark:text-slate-400">{item.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Statutory Thresholds Triggered */}
              <div className="rounded-xl border p-4 space-y-3 dark:border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Statutory Payroll Obligations for {formData.exactHeadcount} Team Members:
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Professional Tax (PT-PTEC & PT-PTRC): </span>
                      Mandatory employer enrollment and monthly employee deduction in {formData.state.split(' ')[0]}.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${
                      formData.exactHeadcount >= 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`} />
                    <div>
                      <span className="font-semibold">ESIC & POSH Policy: </span>
                      {formData.exactHeadcount >= 10
                        ? 'MANDATORY: Gross wages under ₹21,000/mo require ESIC 4% contribution, plus formal POSH Internal Committee with external member.'
                        : 'Optional for <10 staff. POSH policy recommended.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${
                      formData.exactHeadcount >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`} />
                    <div>
                      <span className="font-semibold">EPFO Provident Fund: </span>
                      {formData.exactHeadcount >= 20
                        ? 'MANDATORY: 12% employer + 12% employee contribution for eligible staff.'
                        : 'Exempt until headcount reaches 20 full-time personnel.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVENUE & CROSS-BORDER PLANS */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Step 6: Revenue & Cross-Border Scaling</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t('qRevenue', 'What is your expected Year-1 gross turnover / revenue band?')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Directly defines GST registration mandates (Section 22/24), advance income tax schedules, and statutory audit thresholds.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Projected Annual Turnover
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: '<₹20L', label: 'Under ₹20 Lakhs', note: 'Below GST threshold' },
                      { id: '₹20L–₹40L', label: '₹20L to ₹40L', note: 'Mandatory GST (Services)' },
                      { id: '₹40L–₹1.5Cr', label: '₹40L to ₹1.5Cr', note: 'Standard GST taxpayer' },
                      { id: '₹1.5Cr+', label: 'Above ₹1.5 Crore', note: 'Tax audit & e-Invoicing' },
                    ] as const
                  ).map((rev) => (
                    <button
                      key={rev.id}
                      type="button"
                      onClick={() => updateForm({ revenueThreshold: rev.id as RevenueThreshold })}
                      className={`rounded-xl border p-3 text-center transition ${
                        formData.revenueThreshold === rev.id
                          ? isDark
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : isDark
                          ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{rev.label}</div>
                      <div className="text-[10px] mt-1 text-slate-500 dark:text-slate-400">{rev.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  {t('qCrossBorder', 'What is your cross-border trade / software export profile?')}
                </label>
                <div className="space-y-2.5">
                  {(
                    [
                      {
                        id: 'Export Services (SaaS / Global Tech)',
                        title: 'Export Services (SaaS / Global Tech / Consulting)',
                        desc: 'Clients pay in USD/EUR/GBP. Requires Import Export Code (IEC) & Form GST RFD-11 (Letter of Undertaking) for 0% zero-rated GST export.',
                      },
                      {
                        id: 'None (Domestic Only)',
                        title: 'Purely Domestic Indian Operations',
                        desc: 'All billing and transactions within India. Standard CGST, SGST, and IGST invoicing applies.',
                      },
                      {
                        id: 'Import / Export of Physical Goods',
                        title: 'Import / Export of Physical Goods',
                        desc: 'Requires Customs ICEGATE registration, AD Code registration, and port clearance.',
                      },
                    ] as const
                  ).map((cb) => (
                    <button
                      key={cb.id}
                      type="button"
                      onClick={() => {
                        const hasExim = cb.id !== 'None (Domestic Only)';
                        let eximType: any = 'None (Domestic Only)';
                        if (cb.id === 'Export Services (SaaS / Global Tech)') {
                          eximType = 'Export of Services (SaaS / Tech / Consulting)';
                        } else if (cb.id === 'Import / Export of Physical Goods') {
                          eximType = 'Both Import and Export';
                        }
                        updateForm({
                          crossBorder: cb.id as CrossBorderMode,
                          hasImportExport: hasExim,
                          importExportType: eximType,
                        });
                      }}
                      className={`w-full rounded-xl border p-3.5 text-left transition ${
                        formData.crossBorder === cb.id
                          ? isDark
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : isDark
                          ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-xs flex items-center justify-between">
                        <span>{cb.title}</span>
                        {formData.crossBorder === cb.id && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{cb.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Snapshot Card */}
              <div className={`rounded-xl border p-4 ${
                isDark ? 'border-emerald-900/60 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/60'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Statutory Architecture Summary Ready</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">Entity</div>
                    <div className="font-bold truncate">{formData.entityType}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">State</div>
                    <div className="font-bold truncate">{formData.state.split(' ')[0]}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">Estimated Days</div>
                    <div className="font-bold text-emerald-600 font-mono">18–24 Days</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">Govt Outlay</div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono">₹4,000–₹8,000</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                  : isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-200'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('btnBack', 'Back')}</span>
            </button>

            <button
              type="button"
              id="wizard-next-step-btn"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
            >
              <span>
                {currentStep === totalSteps
                  ? t('btnFinishSetup', 'Complete Setup & Launch Navigator')
                  : t('btnNext', 'Next Step')}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-[11px] text-slate-400 dark:text-slate-600 border-t dark:border-slate-800/50">
        Statutory parameters are dynamically evaluated against Ministry of Corporate Affairs (MCA) and Central Board of Indirect Taxes (CBIC) rules.
      </footer>
    </div>
  );
};
