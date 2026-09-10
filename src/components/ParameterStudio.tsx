import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  Globe2,
  Layers,
  Sparkles,
  Info,
  Check,
  Shield,
  UtensilsCrossed,
  Code2,
  HeartPulse,
  Factory,
  ShoppingBag,
  Coins,
} from 'lucide-react';
import {
  ProfileState,
  EntityStructure,
  OperationalSector,
  RevenueThreshold,
  FootprintType,
  CrossBorderMode,
} from '../types';
import { useApp } from '../context/AppContext';

interface ParameterStudioProps {
  profile: ProfileState;
  onChange: (updated: Partial<ProfileState>) => void;
}

export const ParameterStudio: React.FC<ParameterStudioProps> = ({ profile, onChange }) => {
  const { t } = useApp();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  const entityOptions: { label: EntityStructure; desc: string }[] = [
    { label: 'Private Limited', desc: 'Standard investor-ready entity (MCA SPICe+)' },
    { label: 'Limited Liability Partnership (LLP)', desc: 'Hybrid structure with minimal audit burden' },
    { label: 'One Person Company (OPC)', desc: 'Single-founder corporate status' },
    { label: 'Sole Proprietorship', desc: 'Individual business identity (MSME / Trade)' },
    { label: 'Public Limited', desc: 'Strict governance for listed or public fundraising' },
  ];

  const sectorOptions: {
    label: OperationalSector;
    icon: React.ComponentType<{ className?: string }>;
    triggerNote: string;
  }[] = [
    { label: 'SaaS & Cloud Software', icon: Code2, triggerNote: 'GST LUT, SOFTEX, DPDP' },
    { label: 'F&B / Hospitality', icon: UtensilsCrossed, triggerNote: 'FSSAI, Health Trade, Fire NOC' },
    { label: 'Healthcare & Diagnostics', icon: HeartPulse, triggerNote: 'Clinical Est. & BMW' },
    { label: 'Light Manufacturing', icon: Factory, triggerNote: 'Factories Act, SPCB CTE/CTO' },
    { label: 'Retail & E-Commerce', icon: ShoppingBag, triggerNote: 'Legal Metrology, GST' },
    { label: 'Fintech / NBFC', icon: Coins, triggerNote: 'RBI DPSS, PMLA, ISO 27001' },
  ];

  const revenueOptions: { label: RevenueThreshold; subtitle: string }[] = [
    { label: '<₹20L', subtitle: 'GST Voluntary' },
    { label: '₹20L–₹40L', subtitle: 'Mandatory GST (Services/Goods)' },
    { label: '₹40L–₹1.5Cr', subtitle: 'Composite Scheme / Quarterly' },
    { label: '₹1.5Cr+', subtitle: 'Tax Audit (Sec 44AB) & E-Invoicing' },
  ];

  const footprintOptions: FootprintType[] = [
    'Physical Commercial Premise',
    'Remote / Virtual Office',
  ];

  const crossBorderOptions: CrossBorderMode[] = [
    'None (Domestic Only)',
    'Export Services (SaaS / Global Tech)',
    'Import / Export of Physical Goods',
    'Cross-Border D2C / Foreign Remittances',
  ];

  const handleHeadcountChange = (val: number) => {
    let tier: ProfileState['headcountTier'] = '1–9';
    if (val >= 50) tier = '50+';
    else if (val >= 20) tier = '20–49';
    else if (val >= 10) tier = '10–19';

    onChange({
      exactHeadcount: val,
      headcountTier: tier,
    });
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white luxury-shadow">
      {/* Studio Header */}
      <div className="border-b border-[#F1F5F9] bg-[#FBFBFA] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5B061E] text-white">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <h2 className="font-serif text-lg font-bold tracking-tight text-[#1E1E24]">
              {t('parameterStudio', 'Parameter Studio')}
            </h2>
          </div>
          <span className="rounded bg-[#5B061E]/10 px-2 py-0.5 text-[11px] font-semibold text-[#5B061E]">
            Step {activeStep} of 4
          </span>
        </div>
        <p className="mt-1 text-xs text-[#6B7280]">
          {t('studioSubtitle', 'Adjust legal and operational parameters to recalculate deterministic statutory requirements in real time.')}
        </p>

        {/* Step Navigation Tabs */}
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1 text-center text-xs">
          {[
            { step: 1, label: t('tabLegalIdentity', 'Legal Identity'), icon: Building2 },
            { step: 2, label: t('tabFootprint', 'Footprint'), icon: Briefcase },
            { step: 3, label: t('tabHeadcount', 'Headcount'), icon: Users },
            { step: 4, label: t('tabMonetization', 'Monetization'), icon: TrendingUp },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step as 1 | 2 | 3 | 4)}
              className={`flex flex-col items-center gap-1 rounded-md py-1.5 font-medium transition-all ${
                activeStep === item.step
                  ? 'bg-[#5B061E] text-white shadow-xs'
                  : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span className="text-[10px] sm:text-[11px] truncate px-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Studio Body - Step Panels */}
      <div className="space-y-5 p-4 sm:p-5">
        {/* STEP 1: LEGAL IDENTITY */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="business-name-input" className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Enterprise Trading Name
              </label>
              <input
                id="business-name-input"
                type="text"
                value={profile.businessName}
                onChange={(e) => onChange({ businessName: e.target.value })}
                placeholder="e.g. Acme Technologies Private Limited"
                className="mt-1.5 w-full rounded-lg border border-[#E5E7EB] bg-[#FDFBFA] px-3.5 py-2 text-sm font-medium text-[#1E1E24] transition focus:border-[#5B061E] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B061E]"
              />
            </div>

            {/* Entity Structure Segmented Controls */}
            <div>
              <span className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Legal Entity Structure
              </span>
              <div className="mt-2 space-y-2">
                {entityOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => onChange({ entityType: opt.label })}
                    className={`flex w-full items-start justify-between rounded-lg border p-3 text-left transition-all ${
                      profile.entityType === opt.label
                        ? 'border-[#5B061E] bg-[#FDF2F4] text-[#5B061E] ring-1 ring-[#5B061E]'
                        : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1E1E24]">{opt.label}</div>
                      <div className="mt-0.5 text-[11px] text-[#6B7280]">{opt.desc}</div>
                    </div>
                    {profile.entityType === opt.label && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B061E] text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Incorporation Status Selector */}
            <div>
              <span className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Current Operational Horizon
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    'Pre-Incorporation / Planning',
                    'Filing in Progress',
                    'Actively Commercial',
                  ] as ProfileState['incorporationStatus'][]
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onChange({ incorporationStatus: status })}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition ${
                      profile.incorporationStatus === status
                        ? 'border-[#5B061E] bg-[#5B061E] text-white shadow-xs'
                        : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {status.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: COMMERCIAL FOOTPRINT & SECTOR */}
        {activeStep === 2 && (
          <div className="space-y-4">
            {/* Sector Selection Grid */}
            <div>
              <span className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Operational Sector
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {sectorOptions.map((sec) => (
                  <button
                    key={sec.label}
                    type="button"
                    onClick={() => onChange({ sector: sec.label })}
                    className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                      profile.sector === sec.label
                        ? 'border-[#5B061E] bg-[#FDF2F4] text-[#5B061E] ring-1 ring-[#5B061E]'
                        : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <sec.icon
                        className={`h-4 w-4 ${
                          profile.sector === sec.label ? 'text-[#5B061E]' : 'text-[#6B7280]'
                        }`}
                      />
                      {profile.sector === sec.label && (
                        <div className="h-2 w-2 rounded-full bg-[#5B061E]"></div>
                      )}
                    </div>
                    <span className="mt-2 text-xs font-semibold text-[#1E1E24]">{sec.label}</span>
                    <span className="mt-0.5 text-[10px] text-[#6B7280]">{sec.triggerNote}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Jurisdiction */}
            <div>
              <span className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Location & Municipal Jurisdiction
              </span>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Primary State</label>
                  <select
                    value={profile.state}
                    onChange={(e) => onChange({ state: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E1E24] focus:border-[#5B061E] focus:outline-none"
                  >
                    {[
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
                    ].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">City / Municipal Authority</label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => onChange({ city: e.target.value })}
                    placeholder="e.g. Bengaluru, Mumbai, Gurugram, Pune"
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E1E24] focus:border-[#5B061E] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Physical vs. Remote Facility */}
            <div>
              <span className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Premise & Workspace Footprint
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {footprintOptions.map((fp) => (
                  <button
                    key={fp}
                    type="button"
                    onClick={() => onChange({ footprint: fp })}
                    className={`rounded-lg border p-3 text-center text-xs font-medium transition ${
                      profile.footprint === fp
                        ? 'border-[#5B061E] bg-[#5B061E] text-white shadow-xs'
                        : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {fp}
                  </button>
                ))}
              </div>
            </div>

            {/* Online Delivery Activity Toggle & Model */}
            <div className={`rounded-lg border p-3 transition ${
              profile.hasOnlineDelivery
                ? 'border-[#5B061E]/30 bg-[#FDF2F4]'
                : 'border-[#E5E7EB] bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E1E24] flex items-center gap-1.5">
                    Online Delivery Activity
                    <span className="rounded bg-[#5B061E]/10 text-[#5B061E] px-1 py-0.2 text-[9px] font-bold">
                      Key Trigger
                    </span>
                  </span>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">
                    Triggers FSSAI E-Commerce Endorsement, GST TCS (Sec 52), & Fleet Guidelines
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.hasOnlineDelivery}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onChange({
                      hasOnlineDelivery: checked,
                      onlineDeliveryModel: checked
                        ? (profile.sector === 'F&B / Hospitality'
                            ? 'Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)'
                            : 'E-Commerce Marketplace (Amazon / Flipkart / Meesho)')
                        : 'None',
                    });
                  }}
                  className="h-4 w-4 rounded accent-[#5B061E]"
                />
              </div>

              {profile.hasOnlineDelivery && (
                <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] space-y-1">
                  <label className="block text-[10px] font-semibold text-[#374151]">Fulfillment Channel</label>
                  <select
                    value={profile.onlineDeliveryModel || 'Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)'}
                    onChange={(e) => onChange({ onlineDeliveryModel: e.target.value as any })}
                    className="w-full rounded border border-[#E5E7EB] bg-white px-2 py-1 text-xs font-medium text-[#1E1E24] focus:border-[#5B061E] focus:outline-none"
                  >
                    <option value="Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)">
                      Aggregator (Swiggy / Zomato / Blinkit)
                    </option>
                    <option value="E-Commerce Marketplace (Amazon / Flipkart / Meesho)">
                      Marketplace (Amazon / Flipkart / Meesho)
                    </option>
                    <option value="Direct Delivery (Own Fleet / D2C)">
                      Direct Delivery (Own Fleet / Drivers)
                    </option>
                    <option value="Third-Party Courier Logistics (Shiprocket / BlueDart / Delhivery)">
                      Third-Party Courier (Shiprocket / Delhivery)
                    </option>
                  </select>
                </div>
              )}
            </div>

            {/* Environmental & Specific Toggles */}
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3 space-y-2.5">
              <span className="text-[11px] font-semibold text-[#374151] uppercase tracking-wider">
                Conditional Operational Triggers
              </span>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-[#1E1E24]">Prepares or Distributes Food</span>
                  <p className="text-[10px] text-[#6B7280]">Triggers Central / State FSSAI FoSCoS License</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.handlingFood || profile.sector === 'F&B / Hospitality'}
                  onChange={(e) => onChange({ handlingFood: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5B061E]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-[#1E1E24]">Discharges Industrial Effluent or Emissions</span>
                  <p className="text-[10px] text-[#6B7280]">Triggers SPCB Air/Water Acts Consent (CTE/CTO)</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.handlingEffluentOrPollution}
                  onChange={(e) => onChange({ handlingEffluentOrPollution: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5B061E]"
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: HEADCOUNT & PAYROLL HORIZON */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-[#374151] uppercase">
                  Current Headcount
                </span>
                <span className="font-mono text-sm font-bold text-[#5B061E]">
                  {profile.exactHeadcount} Personnel ({profile.headcountTier} Tier)
                </span>
              </div>

              {/* Headcount Tactile Slider */}
              <div className="mt-3">
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={profile.exactHeadcount}
                  onChange={(e) => handleHeadcountChange(parseInt(e.target.value, 10))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E5E7EB] accent-[#5B061E]"
                />
                {/* Milestone Tick Marks */}
                <div className="mt-2 flex justify-between text-[10px] font-mono text-[#6B7280]">
                  <span>1 (Founder)</span>
                  <span className="font-bold text-[#9B153B]">10 (ESIC)</span>
                  <span className="font-bold text-[#9B153B]">20 (EPFO)</span>
                  <span className="font-bold text-[#9B153B]">50+ (POSH/Gratuity)</span>
                  <span>120+</span>
                </div>
              </div>
            </div>

            {/* Headcount Statutory Impact Cards */}
            <div className="space-y-2.5 pt-2">
              <div
                className={`rounded-lg border p-3 transition ${
                  profile.exactHeadcount >= 10
                    ? 'border-[#D1FAE5] bg-[#ECFDF5] text-[#065F46]'
                    : 'border-[#F1F5F9] bg-[#FBFBFA] text-[#6B7280]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>10+ Headcount: ESIC & POSH Internal Committee</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] uppercase font-bold">
                    {profile.exactHeadcount >= 10 ? 'TRIGGERED' : 'EXEMPT'}
                  </span>
                </div>
                <p className="mt-1 text-[11px]">
                  Employees earning up to ₹21,000/mo must be enrolled in ESIC. Mandates formal
                  constitution of an Internal Committee under POSH Act 2013.
                </p>
              </div>

              <div
                className={`rounded-lg border p-3 transition ${
                  profile.exactHeadcount >= 20
                    ? 'border-[#D1FAE5] bg-[#ECFDF5] text-[#065F46]'
                    : 'border-[#F1F5F9] bg-[#FBFBFA] text-[#6B7280]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>20+ Headcount: EPFO Universal Provident Fund</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] uppercase font-bold">
                    {profile.exactHeadcount >= 20 ? 'TRIGGERED' : 'EXEMPT'}
                  </span>
                </div>
                <p className="mt-1 text-[11px]">
                  Requires mandatory monthly filing of Electronic Challan cum Return (ECR) with 12%
                  employer matching contribution by the 15th of each month.
                </p>
              </div>

              <div
                className={`rounded-lg border p-3 transition ${
                  profile.exactHeadcount >= 50
                    ? 'border-[#D1FAE5] bg-[#ECFDF5] text-[#065F46]'
                    : 'border-[#F1F5F9] bg-[#FBFBFA] text-[#6B7280]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>50+ Headcount: Statutory Crèche & Gratuity Trust</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] uppercase font-bold">
                    {profile.exactHeadcount >= 50 ? 'TRIGGERED' : 'EXEMPT'}
                  </span>
                </div>
                <p className="mt-1 text-[11px]">
                  Triggers statutory crèche provision under Maternity Benefit Act and institutional
                  Payment of Gratuity actuarial group trust creation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MONETIZATION & CROSS-BORDER */}
        {activeStep === 4 && (
          <div className="space-y-4">
            {/* Revenue Threshold Segmented Grid */}
            <div>
              <span className="block text-xs font-semibold tracking-wide text-[#374151] uppercase">
                Projected Annual Revenue Threshold
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {revenueOptions.map((rev) => (
                  <button
                    key={rev.label}
                    type="button"
                    onClick={() => onChange({ revenueThreshold: rev.label })}
                    className={`rounded-lg border p-2.5 text-left transition ${
                      profile.revenueThreshold === rev.label
                        ? 'border-[#5B061E] dark:border-cyan-500 bg-[#FDF2F4] dark:bg-cyan-950/40 text-[#5B061E] dark:text-cyan-300 ring-1 ring-[#5B061E] dark:ring-cyan-500'
                        : 'border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#374151] dark:text-slate-300 hover:bg-[#F9FAFB] dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1E1E24] dark:text-white">{rev.label}</div>
                    <div className="mt-0.5 text-[10px] text-[#6B7280] dark:text-slate-400">{rev.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cross-Border Operations & Import/Export */}
            <div>
              <div className="flex items-center justify-between">
                <span className="block text-xs font-semibold tracking-wide text-[#374151] dark:text-slate-300 uppercase">
                  Cross-Border & Import/Export Activity
                </span>
                <span className="rounded bg-[#5B061E]/10 dark:bg-cyan-950/60 text-[#5B061E] dark:text-cyan-300 px-1 py-0.2 text-[9px] font-bold">
                  Statutory Trigger
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  {
                    id: 'None (Domestic Only)',
                    label: 'None (Purely Domestic Operations)',
                    hasExim: false,
                    eximType: 'None (Domestic Only)',
                  },
                  {
                    id: 'Export Services (SaaS / Global Tech)',
                    label: 'Export of Services (SaaS / Tech / Consulting)',
                    hasExim: true,
                    eximType: 'Export of Services (SaaS / Tech / Consulting)',
                  },
                  {
                    id: 'Import / Export of Physical Goods',
                    label: 'Import / Export of Physical Goods',
                    hasExim: true,
                    eximType: 'Both Import and Export',
                  },
                  {
                    id: 'Cross-Border D2C / Foreign Remittances',
                    label: 'Cross-Border D2C / Foreign Remittances',
                    hasExim: true,
                    eximType: 'Export of Physical Goods',
                  },
                ].map((cb) => (
                  <button
                    key={cb.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        crossBorder: cb.id as any,
                        hasImportExport: cb.hasExim,
                        importExportType: cb.eximType as any,
                      })
                    }
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs font-medium transition ${
                      profile.crossBorder === cb.id
                        ? 'border-[#5B061E] dark:border-cyan-500 bg-[#5B061E] dark:bg-cyan-600 text-white shadow-xs'
                        : 'border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#374151] dark:text-slate-300 hover:bg-[#F9FAFB] dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cb.label}</span>
                    {profile.crossBorder === cb.id && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Cross-Border Trigger Alerts */}
            {(profile.hasImportExport || profile.crossBorder !== 'None (Domestic Only)') && (
              <div className="rounded-lg border border-[#D1FAE5] bg-[#ECFDF5] p-3 text-[#065F46]">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Globe2 className="h-4 w-4 text-[#064E3B]" />
                  <span>Cross-Border Compliance Activated</span>
                </div>
                <ul className="mt-1 list-inside list-disc text-[11px] text-[#047857]">
                  <li>DGFT Import Export Code (IEC) required for foreign currency remittances</li>
                  <li>Customs ICEGATE & Bank AD Code for physical customs clearance</li>
                  <li>Form GST RFD-11 (Letter of Undertaking) to export at 0% zero-rated GST</li>
                  <li>RBI & STPI SOFTEX filing within 30 days of software invoice realization</li>
                </ul>
              </div>
            )}

            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-[#1E1E24]">Processes Personal Customer Data</span>
                  <p className="text-[10px] text-[#6B7280]">Triggers DPDP Act 2023 & GDPR Privacy Notices</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.handlingCustomerPersonalData}
                  onChange={(e) => onChange({ handlingCustomerPersonalData: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5B061E]"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Studio Footer Navigation */}
      <div className="flex items-center justify-between border-t border-[#F1F5F9] bg-[#FBFBFA] px-4 py-3 text-xs">
        <button
          disabled={activeStep === 1}
          onClick={() => setActiveStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : 1))}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 font-medium text-[#374151] transition hover:bg-[#F3F4F6] disabled:opacity-40"
        >
          Previous
        </button>
        <span className="font-mono text-[11px] text-[#9CA3AF]">
          Live Auto-Sync
        </span>
        <button
          disabled={activeStep === 4}
          onClick={() => setActiveStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : 4))}
          className="rounded-lg bg-[#5B061E] dark:bg-cyan-600 px-3.5 py-1.5 font-medium text-white shadow-xs transition hover:bg-[#420415] dark:hover:bg-cyan-500 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};
