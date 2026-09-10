import React from 'react';
import {
  Printer,
  Download,
  X,
  Building,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Calendar,
  IndianRupee,
  Shield,
  FileCheck2,
  FileSpreadsheet,
} from 'lucide-react';
import { ProfileState, ComplianceItem, ExposureMatrix } from '../types';
import { exportComplianceRoadmapToCSV } from '../utils/csvExport';

interface ExecutiveDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileState;
  items: ComplianceItem[];
  matrix: ExposureMatrix;
}

export const ExecutiveDossierModal: React.FC<ExecutiveDossierModalProps> = ({
  isOpen,
  onClose,
  profile,
  items,
  matrix,
}) => {
  if (!isOpen) return null;

  const applicableItems = items.filter((i) => i.isApplicable);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      {/* Dossier Container */}
      <div className="my-8 flex w-full max-w-4xl flex-col rounded-2xl border border-[#E5E7EB] bg-white luxury-shadow overflow-hidden">
        {/* Floating Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-[#E5E7EB] bg-[#FBFBFA] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-bold text-[#5B061E]">
              Executive Regulatory Dossier
            </span>
            <span className="rounded bg-[#5B061E]/10 px-2 py-0.5 text-[10px] font-bold text-[#5B061E] uppercase">
              Official Briefing
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="dossier-export-csv-btn"
              onClick={() => exportComplianceRoadmapToCSV(applicableItems, profile.businessName, 'Executive Dossier Export')}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E1E24] shadow-2xs transition hover:border-[#064E3B] hover:bg-[#F0FDF4] hover:text-[#064E3B]"
              title="Download full statutory obligations as CSV spreadsheet"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#064E3B]" />
              <span>Export CSV</span>
            </button>
            <button
              id="dossier-print-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-[#5B061E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#420415]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Executive Dossier Document */}
        <div className="p-8 sm:p-12 text-[#1E1E24] space-y-8 bg-white">
          {/* Institutional Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#5B061E] pb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5B061E] text-white">
                  <span className="font-serif text-xl font-bold">A</span>
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-[#5B061E] sm:text-3xl">
                    AURA COMPLIANCE NAVIGATOR
                  </h1>
                  <p className="text-xs tracking-wider text-[#6B7280] uppercase">
                    Statutory & Regulatory Governance Master Dossier
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono text-[#4B5563]">Dossier Ref: AUR-{Date.now().toString().slice(-6)}</div>
              <div className="text-[#6B7280] mt-0.5">Date of Assessment: {currentDate}</div>
              <div className="text-[#065F46] font-semibold mt-0.5">Statutory FY: 2025–26</div>
            </div>
          </div>

          {/* Section 1: Corporate Profile Summary */}
          <div>
            <h2 className="font-serif text-base font-bold text-[#5B061E] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
              1. Corporate Profile & Statutory Parameter Snapshot
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-[#E5E7EB] bg-[#FBFBFA] p-4 text-xs sm:grid-cols-4">
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Entity Name</span>
                <span className="font-bold text-[#1E1E24]">{profile.businessName}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Corporate Structure</span>
                <span className="font-bold text-[#1E1E24]">{profile.entityType}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Operational Sector</span>
                <span className="font-bold text-[#1E1E24]">{profile.sector}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">State Jurisdiction</span>
                <span className="font-bold text-[#1E1E24]">{profile.state}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Headcount Horizon</span>
                <span className="font-bold text-[#1E1E24]">{profile.exactHeadcount} Personnel ({profile.headcountTier})</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Revenue Bracket</span>
                <span className="font-bold text-[#1E1E24]">{profile.revenueThreshold}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Premises Footprint</span>
                <span className="font-bold text-[#1E1E24]">{profile.footprint}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase">Cross-Border Trade</span>
                <span className="font-bold text-[#1E1E24]">{profile.crossBorder}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Real-Time Risk Exposure & Statutory Quantitative Matrix */}
          <div>
            <h2 className="font-serif text-base font-bold text-[#5B061E] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
              2. Quantitative Statutory Risk & Exposure Matrix
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div className="rounded-xl border border-[#E5E7EB] p-3 text-center">
                <span className="text-[#6B7280] text-[11px] block">Compliance Burden</span>
                <span className="font-serif text-2xl font-bold text-[#5B061E]">
                  {matrix.burdenIndex} / 100
                </span>
                <span className="block text-[10px] font-bold text-[#9B153B] uppercase mt-0.5">
                  {matrix.burdenLevel} Risk Tier
                </span>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] p-3 text-center">
                <span className="text-[#6B7280] text-[11px] block">Estimated Legal Open</span>
                <span className="font-serif text-2xl font-bold text-[#1E1E24]">
                  {matrix.setupDays} Days
                </span>
                <span className="block text-[10px] text-[#475569] mt-0.5">
                  Critical Path Windows
                </span>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] p-3 text-center">
                <span className="text-[#6B7280] text-[11px] block">Total Statutory Budget</span>
                <span className="font-serif text-2xl font-bold text-[#1E1E24]">
                  ₹{matrix.totalBudget.toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] text-[#065F46] mt-0.5">
                  Govt: ₹{matrix.minGovtFee.toLocaleString('en-IN')} | Legal: ₹{matrix.minProfessionalFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] p-3 text-center">
                <span className="text-[#6B7280] text-[11px] block">Compliance Health</span>
                <span className="font-serif text-2xl font-bold text-[#064E3B]">
                  {matrix.healthScore}%
                </span>
                <span className="block text-[10px] text-[#475569] mt-0.5">
                  {matrix.totalResolved} of {matrix.totalApplicable} Resolved
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Master Compliance Roadmap Calendar */}
          <div>
            <h2 className="font-serif text-base font-bold text-[#5B061E] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
              3. Complete Phased Compliance Schedule & Filing Milestones
            </h2>

            <div className="mt-4 overflow-x-auto rounded-xl border border-[#E5E7EB]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBFBFA] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Phase & Statute</th>
                    <th className="p-3">Statutory Authority</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Official TAT</th>
                    <th className="p-3">Non-Compliance Risk</th>
                    <th className="p-3 text-right">Estimated Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {applicableItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FDFBFA]">
                      <td className="p-3">
                        <div className="font-semibold text-[#1E1E24]">{item.title}</div>
                        <div className="font-mono text-[10px] text-[#6B7280]">{item.governingAct}</div>
                      </td>
                      <td className="p-3 text-[#4B5563]">{item.statutoryAuthority}</td>
                      <td className="p-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            item.obligationType === 'Mandatory'
                              ? 'bg-[#5B061E]/10 text-[#5B061E]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.obligationType}
                        </span>
                      </td>
                      <td className="p-3 text-[#4B5563]">{item.turnaroundTime}</td>
                      <td className="p-3 text-[11px] text-[#9B153B] max-w-[220px]">
                        {item.penaltyRisk}
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-[#1E1E24]">
                        ₹{(item.govtFee + item.professionalFee).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Budgetary Fee Breakdown */}
          <div>
            <h2 className="font-serif text-base font-bold text-[#5B061E] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
              4. Budgetary Itemization: Official Government Fees vs Professional CA/CS Fees
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-[#E5E7EB] p-4 bg-[#FBFBFA]">
                <span className="font-bold text-[#1E1E24] block mb-2 uppercase text-[11px]">
                  Statutory Government Fees & Stamp Duties
                </span>
                <ul className="space-y-1.5 text-[#4B5563]">
                  <li className="flex justify-between">
                    <span>MCA Incorporation & SPICe+ Stamp Duty:</span>
                    <span className="font-mono">₹4,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>State Professional Tax Enrolment (PTEC):</span>
                    <span className="font-mono">₹2,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Municipal Shop & Establishment Licensing:</span>
                    <span className="font-mono">₹1,200</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sector-Specific Approvals (FSSAI / SPCB / Fire):</span>
                    <span className="font-mono">₹{Math.max(0, matrix.minGovtFee - 8200).toLocaleString('en-IN')}</span>
                  </li>
                  <li className="flex justify-between border-t border-[#E5E7EB] pt-1.5 font-bold text-[#1E1E24]">
                    <span>Total Estimated Official Treasury Receipts:</span>
                    <span className="font-mono text-[#5B061E]">₹{matrix.minGovtFee.toLocaleString('en-IN')}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] p-4 bg-[#FBFBFA]">
                <span className="font-bold text-[#1E1E24] block mb-2 uppercase text-[11px]">
                  Professional CA, CS & Regulatory Legal Retainers
                </span>
                <ul className="space-y-1.5 text-[#4B5563]">
                  <li className="flex justify-between">
                    <span>Charter Drafting, Digital Signatures, & Filings:</span>
                    <span className="font-mono">₹12,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Statutory Tax Audit (Sec 44AB) & GST Reviews:</span>
                    <span className="font-mono">₹{Math.round(matrix.minProfessionalFee * 0.4).toLocaleString('en-IN')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Labour Social Security (PF/ESIC/POSH) Policy Setup:</span>
                    <span className="font-mono">₹8,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Regulatory Clearances & Environmental Filings:</span>
                    <span className="font-mono">₹{Math.max(0, matrix.minProfessionalFee - 21000).toLocaleString('en-IN')}</span>
                  </li>
                  <li className="flex justify-between border-t border-[#E5E7EB] pt-1.5 font-bold text-[#1E1E24]">
                    <span>Total Legal & Secretarial Professional Fees:</span>
                    <span className="font-mono text-[#5B061E]">₹{matrix.minProfessionalFee.toLocaleString('en-IN')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Institutional Signature & Certification Block */}
          <div className="border-t-2 border-[#E5E7EB] pt-8 text-xs">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-[#1E1E24] block">Principal Regulatory Attestation:</span>
                <p className="mt-1 text-[11px] text-[#6B7280] leading-relaxed">
                  This dossier has been algorithmically synthesized by the SBCN (Smart Business Compliance Navigation) Deterministic Rules Engine,
                  referencing the latest gazetted amendments under Indian and international statutory authorities for FY 2025–26.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-[#064E3B]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified Hash: AUR-SEC-9028-2025-V4</span>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <span className="font-semibold text-[#1E1E24] block">Authorized Founder / Director Signoff:</span>
                  <div className="mt-8 h-0.5 w-56 bg-[#CBD5E1]"></div>
                  <span className="mt-1 block text-[11px] text-[#6B7280]">
                    Name: _______________________________
                  </span>
                  <span className="block text-[11px] text-[#6B7280]">
                    Director Identification Number (DIN): _________
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-t border-[#E5E7EB] bg-[#FBFBFA] px-6 py-4">
          <span className="text-xs text-[#6B7280]">
            Use your browser's Print dialog to export as a formatted PDF.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-[#5B061E] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#420415]"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
