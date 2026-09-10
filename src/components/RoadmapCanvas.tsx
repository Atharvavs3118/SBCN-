import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Building,
  FileCheck,
  Check,
  HelpCircle,
  Download,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { ComplianceItem, ComplianceStatus } from '../types';
import { exportComplianceRoadmapToCSV } from '../utils/csvExport';
import { useApp } from '../context/AppContext';

interface RoadmapCanvasProps {
  items: ComplianceItem[];
  businessName?: string;
  onStatusChange: (itemId: string, status: ComplianceStatus) => void;
  onAskAIAboutItem: (item: ComplianceItem) => void;
}

type PhaseFilter = 'All' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4';
type StatusFilter = 'ALL' | 'MANDATORY_ONLY' | 'PENDING_ONLY' | 'RESOLVED_ONLY';

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  items,
  businessName = 'Aura Compliance',
  onStatusChange,
  onAskAIAboutItem,
}) => {
  const { t } = useApp();
  const [phaseTab, setPhaseTab] = useState<PhaseFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applicableItems = useMemo(() => items.filter((i) => i.isApplicable), [items]);

  const handleExport = (filteredOnly: boolean = false) => {
    const targetItems = filteredOnly ? filteredItems : applicableItems;
    const label = filteredOnly ? 'Filtered View' : 'Full Roadmap';
    exportComplianceRoadmapToCSV(targetItems, businessName, label);
    setShowExportMenu(false);
    setExportFeedback(`Exported ${targetItems.length} obligations to CSV spreadsheet (${label}).`);
    setTimeout(() => {
      setExportFeedback(null);
    }, 4500);
  };

  const filteredItems = useMemo(() => {
    return applicableItems.filter((item) => {
      // Phase tab filter
      if (phaseTab === 'Phase 1' && item.phase !== 1) return false;
      if (phaseTab === 'Phase 2' && item.phase !== 2) return false;
      if (phaseTab === 'Phase 3' && item.phase !== 3) return false;
      if (phaseTab === 'Phase 4' && item.phase !== 4) return false;

      // Status filter
      if (statusFilter === 'MANDATORY_ONLY' && item.obligationType !== 'Mandatory') return false;
      if (statusFilter === 'PENDING_ONLY' && item.userStatus === 'Completed') return false;
      if (statusFilter === 'RESOLVED_ONLY' && item.userStatus !== 'Completed') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchAct = item.governingAct.toLowerCase().includes(q);
        const matchAuth = item.statutoryAuthority.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        if (!matchTitle && !matchAct && !matchAuth && !matchSummary) return false;
      }

      return true;
    });
  }, [applicableItems, phaseTab, statusFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const getPhaseBadgeColor = (phase: number) => {
    switch (phase) {
      case 1:
        return 'bg-[#5B061E]/10 dark:bg-cyan-950/60 text-[#5B061E] dark:text-cyan-300 border-[#5B061E]/20 dark:border-cyan-800/50';
      case 2:
        return 'bg-[#064E3B]/10 text-[#064E3B] border-[#064E3B]/20';
      case 3:
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 4:
        return 'bg-amber-50 text-amber-900 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getObligationPill = (type: ComplianceItem['obligationType']) => {
    switch (type) {
      case 'Mandatory':
        return 'bg-[#5B061E] dark:bg-cyan-600 text-white';
      case 'Conditional':
        return 'bg-[#D97706] text-white';
      case 'Optional':
        return 'bg-[#6B7280] text-white';
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white luxury-shadow">
      {/* Canvas Header & Filter Bar */}
      <div className="border-b border-[#F1F5F9] bg-[#FBFBFA] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#064E3B] text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              <h2 className="font-serif text-lg font-bold tracking-tight text-[#1E1E24]">
                {t('roadmapTitle', 'Phased Statutory Action Roadmap')}
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {t('roadmapSubtitle', 'Chronologically grouped statutory obligations with turnaround times and non-compliance exposures.')}
            </p>
          </div>

          {/* Search Box & CSV Export Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative w-full sm:w-52">
              <Search className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder', 'Search acts, portals...')}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white py-1.5 pr-3 pl-8 text-xs font-medium text-[#1E1E24] shadow-2xs transition focus:border-[#5B061E] focus:outline-none"
              />
            </div>

            {/* CSV Export Button & Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <div className="inline-flex rounded-lg border border-[#E5E7EB] bg-white shadow-2xs transition hover:border-[#064E3B]">
                <button
                  id="btn-export-csv-main"
                  onClick={() => handleExport(false)}
                  className="flex items-center gap-1.5 rounded-l-lg px-2.5 py-1.5 text-xs font-semibold text-[#1E1E24] transition hover:bg-[#F0FDF4] hover:text-[#064E3B] active:scale-95"
                  title="Export all compliance obligations to CSV"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[#064E3B]" />
                  <span>{t('btnExportCSV', 'Export CSV')}</span>
                </button>
                <button
                  id="btn-export-csv-dropdown"
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  className="border-l border-[#E5E7EB] px-1.5 py-1.5 text-[#6B7280] transition hover:bg-[#F0FDF4] hover:text-[#064E3B]"
                  title="More CSV export options"
                  aria-expanded={showExportMenu}
                  aria-haspopup="true"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 z-30 w-64 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-xl animate-fadeIn">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Spreadsheet Export
                  </div>
                  <button
                    onClick={() => handleExport(false)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#1E1E24] transition hover:bg-[#F0FDF4] hover:text-[#064E3B]"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="h-3.5 w-3.5 text-[#064E3B]" />
                      <span>Full Roadmap</span>
                    </div>
                    <span className="rounded bg-[#064E3B]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#064E3B]">
                      {applicableItems.length} items
                    </span>
                  </button>

                  <button
                    onClick={() => handleExport(true)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#1E1E24] transition hover:bg-[#F0FDF4] hover:text-[#064E3B]"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-[#5B061E]" />
                      <span>Current Filtered View</span>
                    </div>
                    <span className="rounded bg-[#5B061E]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#5B061E]">
                      {filteredItems.length} items
                    </span>
                  </button>

                  <div className="mt-1 border-t border-[#F3F4F6] px-2 py-1 text-[10px] text-[#9CA3AF]">
                    Includes statutory fees, acts, turnaround windows & audit checklists.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {exportFeedback && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2 text-xs font-medium text-[#065F46] animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#059669]" />
              <span>{exportFeedback}</span>
            </div>
            <button
              onClick={() => setExportFeedback(null)}
              className="text-[#065F46] hover:text-[#047857] p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Phase Filter Tabs */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { tab: 'All', label: `${t('filterAll', 'All Obligations')} (${applicableItems.length})` },
                { tab: 'Phase 1', label: '1: Pre-Launch' },
                { tab: 'Phase 2', label: '2: Operational' },
                { tab: 'Phase 3', label: '3: Headcount' },
                { tab: 'Phase 4', label: '4: Recurring' },
              ] as { tab: PhaseFilter; label: string }[]
            ).map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => setPhaseTab(tab)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  phaseTab === tab
                    ? 'bg-[#5B061E] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Secondary Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-[#9CA3AF]" />
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white py-1 pr-7 pl-2 text-xs font-medium text-[#374151] shadow-2xs focus:border-[#5B061E] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="MANDATORY_ONLY">Mandatory Only</option>
              <option value="PENDING_ONLY">{t('statusPending', 'Pending Action')}</option>
              <option value="RESOLVED_ONLY">{t('statusCompleted', 'Resolved / Done')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3.5 p-4 sm:p-5">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] py-12 text-center">
            <HelpCircle className="h-8 w-8 text-[#9CA3AF]" />
            <p className="mt-2 text-sm font-semibold text-[#374151]">No statutory items match your filter</p>
            <p className="text-xs text-[#6B7280]">Try clearing your search query or selecting "All Obligations".</p>
            <button
              onClick={() => {
                setPhaseTab('All');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#5B061E] hover:bg-[#FDF2F4]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedCardId === item.id;
            const isResolved = item.userStatus === 'Completed' || item.userStatus === 'Waived';

            return (
              <div
                key={item.id}
                className={`group rounded-xl border transition-all duration-200 ${
                  isResolved
                    ? 'border-[#D1FAE5] bg-[#F9FDFB]'
                    : item.penaltySeverity === 'Critical'
                      ? 'border-[#E5E7EB] bg-white hover:border-[#5B061E]/40 hover:luxury-shadow'
                      : 'border-[#E5E7EB] bg-white hover:border-[#CBD5E1] hover:luxury-shadow-sm'
                }`}
              >
                {/* Card Main Row */}
                <div className="p-4">
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span
                          className={`rounded border px-2 py-0.5 font-mono font-medium ${getPhaseBadgeColor(
                            item.phase
                          )}`}
                        >
                          {item.phaseLabel.split(':')[0]}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getObligationPill(
                            item.obligationType
                          )}`}
                        >
                          {item.obligationType}
                        </span>
                        <span className="rounded bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#475569]">
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Authority */}
                      <div className="mt-2 flex items-start gap-2">
                        <button
                          onClick={() =>
                            onStatusChange(
                              item.id,
                              item.userStatus === 'Completed' ? 'Pending' : 'Completed'
                            )
                          }
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                            item.userStatus === 'Completed'
                              ? 'border-[#064E3B] bg-[#064E3B] text-white'
                              : 'border-[#D1D5DB] bg-white text-transparent hover:border-[#5B061E]'
                          }`}
                          title={item.userStatus === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <div>
                          <h3
                            className={`font-serif text-base font-bold tracking-tight sm:text-lg ${
                              item.userStatus === 'Completed'
                                ? 'text-[#064E3B] line-through decoration-[#064E3B]/40'
                                : 'text-[#1E1E24]'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B7280]">
                            <span>
                              Authority: <strong className="text-[#374151]">{item.statutoryAuthority}</strong>
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-[#4B5563]">{item.governingAct}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Turnaround Time & Interactive Status Dropdown */}
                    <div className="flex flex-wrap items-center gap-2 self-start sm:flex-col sm:items-end">
                      <div className="flex items-center gap-1 rounded bg-[#F8FAFC] px-2 py-1 text-xs font-medium text-[#475569] border border-[#E2E8F0]">
                        <Clock className="h-3 w-3 text-[#64748B]" />
                        <span>TAT: {item.turnaroundTime}</span>
                      </div>

                      <select
                        aria-label={`Status for ${item.title}`}
                        value={item.userStatus}
                        onChange={(e) => onStatusChange(item.id, e.target.value as ComplianceStatus)}
                        className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium focus:outline-none ${
                          item.userStatus === 'Completed'
                            ? 'border-[#10B981] bg-[#ECFDF5] text-[#065F46]'
                            : item.userStatus === 'In Progress'
                              ? 'border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]'
                              : item.userStatus === 'Waived'
                                ? 'border-[#9CA3AF] bg-[#F3F4F6] text-[#4B5563]'
                                : 'border-[#E5E7EB] bg-white text-[#374151]'
                        }`}
                      >
                        <option value="Pending">{t('statusPending', 'Pending Action')}</option>
                        <option value="In Progress">{t('statusInProgress', 'In Progress')}</option>
                        <option value="Completed">{t('statusCompleted', 'Completed ✓')}</option>
                        <option value="Waived">{t('statusWaived', 'Exempt / Waived')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Intelligent Recommendation Rationale */}
                  {item.whyRecommended && (
                    <div className="mt-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/40 p-2.5 text-xs text-blue-900 dark:text-blue-200">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1">
                          <strong className="font-semibold text-blue-800 dark:text-blue-300">Why recommended for your business:</strong>{' '}
                          <span>
                            {typeof item.whyRecommended === 'string'
                              ? item.whyRecommended
                              : item.whyRecommended.reason}
                          </span>

                          {typeof item.whyRecommended === 'object' &&
                            item.whyRecommended.triggeredBy &&
                            item.whyRecommended.triggeredBy.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-blue-200/60 dark:border-blue-800/40">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 dark:text-blue-400">
                                  Triggered By:
                                </span>
                                {item.whyRecommended.triggeredBy.map((trig, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="rounded bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.2 font-mono text-[10px] font-medium text-blue-800 dark:text-blue-200"
                                  >
                                    {trig}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Non-compliance penalty risk callout */}
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-[#FDF2F4] dark:border-cyan-800/60 bg-[#FDF2F4]/80 dark:bg-cyan-950/40 p-2.5 text-xs text-[#9B153B] dark:text-cyan-300">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5B061E] dark:text-cyan-400" />
                    <div className="flex-1">
                      <strong className="font-semibold text-[#5B061E] dark:text-cyan-300">{t('penaltyExposure', 'Statutory Penalty Exposure:')}</strong>{' '}
                      {item.penaltyRisk}
                    </div>
                  </div>

                  {/* Card Bottom Bar: Expand Trigger & AI Copilot Action */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#F1F5F9] pt-2 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-center gap-1 font-medium text-[#5B061E] dark:text-cyan-400 hover:underline"
                      >
                        <span>{isExpanded ? 'Hide Compliance Specs' : `View Requirements & Checklist (${item.checklist.length} docs)`}</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      <span className="hidden text-[#9CA3AF] sm:inline">•</span>

                      <span className="hidden text-[#6B7280] sm:inline">
                        Govt Fee: ₹{item.govtFee.toLocaleString('en-IN')} | Legal/CA: ₹
                        {item.professionalFee.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAskAIAboutItem(item)}
                        className="flex items-center gap-1 rounded bg-[#FDF2F4] dark:bg-cyan-950/60 px-2 py-1 text-[11px] font-semibold text-[#5B061E] dark:text-cyan-300 transition hover:bg-[#5B061E] dark:hover:bg-cyan-600 hover:text-white"
                        title="Consult AI about this statute"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{t('btnAskAI', 'Ask AI Analyst')}</span>
                      </button>

                      <a
                        href={item.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-medium text-[#374151] hover:bg-[#F8F9FA]"
                      >
                        <span>{item.portalName}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion: Checklist & Prerequisites */}
                {isExpanded && (
                  <div className="border-t border-[#F1F5F9] bg-[#FBFBFA] p-4 sm:p-5 text-xs text-[#374151] space-y-4">
                    <div>
                      <span className="font-bold text-[#1E1E24] uppercase tracking-wider text-[10px]">
                        Statutory Framework Summary
                      </span>
                      <p className="mt-1 leading-relaxed text-[#4B5563]">{item.summary}</p>
                    </div>

                    {/* Generated Document Checklist with Formats */}
                    {item.detailedDocuments && item.detailedDocuments.length > 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[#1E1E24] text-xs flex items-center gap-1.5">
                            <FileCheck className="h-4 w-4 text-emerald-600" />
                            <span>Generated Document Checklist ({item.detailedDocuments.length} Verified Files)</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Standard Statutory Verification</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {item.detailedDocuments.map((doc, dIdx) => (
                            <div key={dIdx} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs">
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-semibold text-slate-800">{doc.name}</span>
                                <span className="rounded bg-blue-50 text-blue-700 font-mono text-[9px] px-1.5 py-0.5 border border-blue-100 shrink-0">
                                  {doc.format}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1">{doc.description}</div>
                              <div className="text-[10px] text-slate-400 mt-1">Authority: {doc.authority}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Prerequisites */}
                      <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
                        <span className="font-semibold text-[#1E1E24] block mb-1.5">
                          Prerequisites & Mandates:
                        </span>
                        <ul className="space-y-1 list-disc list-inside text-[#4B5563]">
                          {item.prerequisites.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Actionable Document Checklist items */}
                      <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
                        <span className="font-semibold text-[#1E1E24] block mb-1.5">
                          Filing Checklist Items:
                        </span>
                        <ul className="space-y-1 list-disc list-inside text-[#4B5563]">
                          {item.checklist.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
