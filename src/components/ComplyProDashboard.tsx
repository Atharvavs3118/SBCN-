import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileText,
  Folder,
  CheckSquare,
  BarChart3,
  Bell,
  Settings,
  Search,
  ChevronRight,
  ChevronDown,
  Landmark,
  Scale,
  Leaf,
  UploadCloud,
  FileCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  Sliders,
  Filter,
  Download,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { ProfileState, ComplianceItem, ComplianceStatus, ExposureMatrix } from '../types';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ParameterStudio } from './ParameterStudio';
import { CircularProgressRing } from './CircularProgressRing';

export type DashboardTab =
  | 'overview'
  | 'checklist'
  | 'documents'
  | 'regulations'
  | 'reports'
  | 'alerts'
  | 'settings';

interface ComplyProDashboardProps {
  profile: ProfileState;
  onProfileChange: (updated: Partial<ProfileState>) => void;
  items: ComplianceItem[];
  matrix: ExposureMatrix;
  onStatusChange: (itemId: string, status: ComplianceStatus) => void;
  onAskAIAboutItem: (item: ComplianceItem) => void;
  onOpenAuditor: () => void;
  onOpenAIDesk: () => void;
  onOpenDossier: () => void;
  onExportCSV: () => void;
  onOpenWizard: () => void;
  onGoToLanding: () => void;
  onSelectPreset: (presetKey: string) => void;
  onOpenChecklist?: () => void;
  onOpenProfile?: () => void;
}

export const ComplyProDashboard: React.FC<ComplyProDashboardProps> = ({
  profile,
  onProfileChange,
  items,
  matrix,
  onStatusChange,
  onAskAIAboutItem,
  onOpenAuditor,
  onOpenAIDesk,
  onOpenDossier,
  onExportCSV,
  onOpenWizard,
  onGoToLanding,
  onSelectPreset,
  onOpenChecklist,
  onOpenProfile,
}) => {
  const { founderName, logout, t } = useApp();
  const { isDark } = useTheme();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedTaskModal, setSelectedTaskModal] = useState<any | null>(null);

  // Derive live counts and compliance readiness score from actual evaluation items and matrix
  const stats = useMemo(() => {
    const applicableItems = items.filter((i) => i.isApplicable !== false);
    const total = applicableItems.length;
    const completed = applicableItems.filter((i) => i.userStatus === 'Completed').length;
    const inProgress = applicableItems.filter((i) => i.userStatus === 'In Progress').length;
    const waived = applicableItems.filter((i) => i.userStatus === 'Waived').length;
    const pending = applicableItems.filter((i) => i.userStatus === 'Pending').length;
    const overdue = applicableItems.filter(
      (i) => i.userStatus === 'Pending' && i.obligationType === 'Mandatory'
    ).length;

    // Real-time compliance readiness score:
    // If matrix provides healthScore, use matrix.healthScore (which weights mandatory vs conditional items).
    // Otherwise calculate dynamically: Math.round(((completed + waived) / total) * 100).
    const readinessScore =
      typeof matrix?.healthScore === 'number'
        ? matrix.healthScore
        : total > 0
          ? Math.round(((completed + waived) / total) * 100)
          : 0;

    return {
      total: total > 0 ? total : 0,
      completed,
      inProgress,
      waived,
      pending,
      overdue,
      readinessScore,
      percentage: readinessScore,
    };
  }, [items, matrix]);

  // Specific upcoming tasks matching Image 2
  const upcomingTasks = [
    {
      id: 'task-1',
      title: 'File Income Tax Return (AY 2025-26)',
      category: 'Tax',
      categoryColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      dueDate: '15 Sep 2025',
      status: 'Overdue',
      statusColor: 'bg-rose-100 text-rose-700 dark:bg-cyan-950/60 dark:text-cyan-400',
      authority: 'Income Tax Dept (ITR-6)',
      details: 'Statutory deadline for filing corporate annual tax return. Failure triggers Sec 234F penalties up to ₹50,000 and interest.',
    },
    {
      id: 'task-2',
      title: 'Renew Factory License',
      category: 'Legal',
      categoryColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      dueDate: '20 Sep 2025',
      status: 'In Progress',
      statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
      authority: 'Department of Directorate of Factories',
      details: 'Annual factory operational renewal under Factories Act 1948. Inspection logs and safety compliance must be enclosed.',
    },
    {
      id: 'task-3',
      title: 'Data Protection Impact Assessment',
      category: 'Data Privacy',
      categoryColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
      dueDate: '25 Sep 2025',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      authority: 'Data Protection Board of India (DPDPA 2023)',
      details: 'Audit data flows, user consent mechanisms, and cross-border transfer agreements for all enterprise customer data.',
    },
    {
      id: 'task-4',
      title: 'ESG Report Submission',
      category: 'Environmental',
      categoryColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      dueDate: '30 Sep 2025',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      authority: 'State Pollution Control Board / SEBI BRSR',
      details: 'Annual sustainability disclosures on energy consumption, electronic waste recycling, and carbon offset reporting.',
    },
    {
      id: 'task-5',
      title: 'GST Return Filing (GSTR-1)',
      category: 'Tax',
      categoryColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      dueDate: '5 Oct 2025',
      status: 'In Progress',
      statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
      authority: 'Goods & Services Tax Network (GSTN)',
      details: 'Monthly outward supplies return. Invoices must be uploaded and matched before recipient can claim Input Tax Credit.',
    },
  ];

  // Filter tasks if searching
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return upcomingTasks;
    const q = searchQuery.toLowerCase();
    return upcomingTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full flex bg-[#F4F7FC] dark:bg-[#070C18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR (Matching Image 2 Exact Navy Design)        */}
      {/* ============================================================ */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800 bg-[#091024] text-white p-4 select-none z-30">
        <div>
          {/* Brand Emblem - SBCN (Smart Business Compliance Navigation) */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                SBCN
              </div>
              <p className="text-[10px] font-normal text-slate-400">
                Smart Business Compliance Navigation
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-medium">
            {/* 1. Dashboard */}
            <button
              id="sidebar-nav-dashboard"
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="h-4 w-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span>Dashboard</span>
            </button>

            {/* 2. Compliance Checklist */}
            <button
              id="sidebar-nav-checklist"
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'checklist'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <CheckSquare className="h-4 w-4 text-slate-400 group-hover:text-white" />
              <span>Compliance Checklist</span>
            </button>

            {/* 3. Documents */}
            <button
              id="sidebar-nav-documents"
              type="button"
              onClick={() => {
                setActiveTab('documents');
                onOpenAuditor();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Folder className="h-4 w-4 text-slate-400" />
              <span>Documents</span>
            </button>

            {/* 4. Regulations */}
            <button
              id="sidebar-nav-regulations"
              type="button"
              onClick={() => setActiveTab('regulations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'regulations'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4 text-slate-400" />
              <span>Regulations</span>
            </button>

            {/* 5. Reports */}
            <button
              id="sidebar-nav-reports"
              type="button"
              onClick={() => {
                setActiveTab('reports');
                onOpenDossier();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4 text-slate-400" />
              <span>Reports</span>
            </button>

            {/* 6. Alerts */}
            <button
              id="sidebar-nav-alerts"
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'alerts'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-slate-400" />
                <span>Alerts</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 dark:bg-cyan-500 text-[10px] font-bold text-white shadow-xs">
                3
              </span>
            </button>

            {/* 7. Settings */}
            <button
              id="sidebar-nav-settings"
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Card (Matching Image 2) */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#0F1B3E] to-[#0A122A] p-4 text-slate-200">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-blue-600/20 blur-xl" />
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/40 mb-3">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h2 className="text-xs font-bold text-white">Your business. Our priority.</h2>
          <p className="mt-1 text-[11px] text-slate-400 leading-snug">
            Stay ahead of regulations with smart compliance tools.
          </p>
          <button
            type="button"
            onClick={onOpenAIDesk}
            className="mt-3 w-full rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 py-1.5 text-[11px] font-semibold text-blue-300 transition text-center"
          >
            Launch AI Assistant
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN APP CONTENT + TOP BAR                                */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar (Matching Image 2) */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#091024]/95 px-4 sm:px-8 backdrop-blur-md transition-colors">
          {/* Left: Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regulations, documents, or tasks..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-2 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition"
            />
          </div>

          {/* Right: Controls & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4 ml-4">
            {/* Multi-language Selector */}
            <LanguageSelector compact />

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle showLabel={false} />

            {/* Notification Bell with Badge */}
            <button
              id="dashboard-bell-alerts"
              type="button"
              onClick={() => setActiveTab('alerts')}
              className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 dark:bg-cyan-500 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            {/* User Profile Pill Menu */}
            <div className="relative">
              <button
                id="user-profile-menu-button"
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#091024] dark:bg-blue-600 text-white font-bold text-xs ring-2 ring-slate-200 dark:ring-slate-700">
                  {(founderName || 'Founder')
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'FD'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                    {founderName || 'Business Founder'}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Business Admin
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white">{founderName || 'Business Founder'}</p>
                    <p className="text-[11px] text-slate-400">{profile.businessName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenWizard();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition"
                  >
                    <Sliders className="h-4 w-4 text-blue-500" />
                    <span>Run Setup Wizard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenDossier();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition"
                  >
                    <Download className="h-4 w-4 text-emerald-500" />
                    <span>Export Compliance Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onExportCSV();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition"
                  >
                    <FileCheck className="h-4 w-4 text-cyan-500" />
                    <span>Download CSV Audit Sheet</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-cyan-400 hover:bg-rose-50 dark:hover:bg-cyan-950/40 text-left transition font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Sub-view Routing */}
        {activeTab === 'overview' && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Grid layout: Left 8-cols & Right 4-cols */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT / CENTER COLUMN (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. HERO WELCOME BANNER (Matching Image 2 with subtle motion) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1A3D] via-[#102758] to-[#143575] text-white p-6 sm:p-8 shadow-xl"
                >
                  {/* Subtle decorative curved neon wave lines */}
                  <svg className="pointer-events-none absolute right-0 top-0 h-full w-2/3 opacity-20" viewBox="0 0 500 200" fill="none">
                    <path d="M0 120 C 150 40, 300 180, 500 80" stroke="#60A5FA" strokeWidth="2" fill="none" />
                    <path d="M0 150 C 180 80, 320 190, 500 120" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
                  </svg>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Welcome Text & Metrics */}
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                          Welcome back, {founderName ? founderName.split(' ')[0] : 'Founder'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Here's your business compliance overview
                        </p>
                      </div>

                      {/* 4 Metrics in Hero Banner */}
                      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                        {/* Metric 1 */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-300 font-medium">Total Requirements</p>
                            <p className="text-xl font-extrabold text-white">{stats.total}</p>
                          </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 backdrop-blur-xs">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-300 font-medium">Completed</p>
                            <p className="text-xl font-extrabold text-white">{stats.completed}</p>
                          </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 backdrop-blur-xs">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-300 font-medium">In Progress</p>
                            <p className="text-xl font-extrabold text-white">{stats.inProgress}</p>
                          </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 dark:bg-cyan-500/20 text-rose-400 dark:text-cyan-300 backdrop-blur-xs">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-300 font-medium">Overdue</p>
                            <p className="text-xl font-extrabold text-white">{stats.overdue}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Shield Graphic & Mini Readiness Progress Ring */}
                    <div className="hidden md:flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <CircularProgressRing
                        score={stats.readinessScore}
                        size={84}
                        strokeWidth={7}
                        label="Score"
                        showPill={false}
                      />
                      <span className="text-[11px] font-bold text-white mt-1">Readiness Score</span>
                      <span className="text-[10px] text-blue-200">
                        {stats.completed} of {stats.total} Checked
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Missing or Incomplete Information Alert Banner */}
                {matrix.missingInfoAlerts && matrix.missingInfoAlerts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-4.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                              Missing or Incomplete Profile Information ({matrix.missingInfoAlerts.length})
                            </h3>
                            <span className="rounded bg-amber-200/70 dark:bg-amber-900/80 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                              Impacts Precision
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                            Some business details are unset. Providing them will generate hyper-accurate license recommendations.
                          </p>

                          <div className="mt-2.5 space-y-1.5">
                            {matrix.missingInfoAlerts.map((alert, aIdx) => (
                              <div key={aIdx} className="flex flex-wrap items-center gap-1.5 text-xs text-amber-950 dark:text-amber-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                                <strong className="font-semibold">{alert.message}:</strong>
                                <span className="text-amber-800 dark:text-amber-300 text-[11px]">{alert.impactOnRecommendations}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onOpenWizard}
                        className="shrink-0 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition"
                      >
                        Complete Profile
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Intelligent Compliance Readiness & Risk Scorecard */}
                {matrix.readinessBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            Intelligent Compliance Readiness & Risk Score
                          </h2>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            matrix.readinessBreakdown.riskTier === 'LOW'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : matrix.readinessBreakdown.riskTier === 'MODERATE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-cyan-950 dark:text-cyan-300'
                          }`}>
                            {matrix.readinessBreakdown.riskTier} RISK TIER
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Calculated from statutory governance gates, tax filings, and regulatory liability exposure
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Penalty Exposure</div>
                          <div className="text-sm font-extrabold text-rose-600 dark:text-cyan-400 font-mono">
                            ₹{matrix.readinessBreakdown.estimatedPenaltyExposureInINR.toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Circular Progress Ring in scorecard */}
                        <div className="flex items-center gap-2">
                          <CircularProgressRing
                            score={stats.readinessScore}
                            size={56}
                            strokeWidth={5}
                            label="Score"
                            showPill={false}
                          />
                          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                            <span className="text-xl font-black">{matrix.readinessBreakdown.overallGrade}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4 Pillars Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[11px] text-slate-500 font-medium">Corporate</span>
                          <span className="font-bold text-slate-800 dark:text-white font-mono">
                            {matrix.readinessBreakdown.pillarScores.corporateGovernance}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${matrix.readinessBreakdown.pillarScores.corporateGovernance}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">ROC, DIR, Inc-20A</span>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[11px] text-slate-500 font-medium">Tax & GST</span>
                          <span className="font-bold text-slate-800 dark:text-white font-mono">
                            {matrix.readinessBreakdown.pillarScores.taxAndGst}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${matrix.readinessBreakdown.pillarScores.taxAndGst}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">GST, Advance Tax, TDS</span>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[11px] text-slate-500 font-medium">Labor & Staff</span>
                          <span className="font-bold text-slate-800 dark:text-white font-mono">
                            {matrix.readinessBreakdown.pillarScores.laborAndWorkforce}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${matrix.readinessBreakdown.pillarScores.laborAndWorkforce}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">EPFO, ESIC, Shops Act</span>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[11px] text-slate-500 font-medium">Industry Specific</span>
                          <span className="font-bold text-slate-800 dark:text-white font-mono">
                            {matrix.readinessBreakdown.pillarScores.industrySpecific}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${matrix.readinessBreakdown.pillarScores.industrySpecific}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">FSSAI, Exim, Delivery</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. FOUR CATEGORY CARDS (Matching Image 2 with motion) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Card 1: Tax Compliance */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setActiveTab('checklist')}
                    className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4.5 shadow-2xs hover:shadow-md transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                        <Landmark className="h-5 w-5" />
                      </div>
                    </div>
                    <h2 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                      Tax Compliance
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      GST, Income Tax, TDS
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        On Track
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </motion.div>

                  {/* Card 2: Legal Compliance */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setActiveTab('checklist')}
                    className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4.5 shadow-2xs hover:shadow-md transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        <Scale className="h-5 w-5" />
                      </div>
                    </div>
                    <h2 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                      Legal Compliance
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Company Law, Filings
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        On Track
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </motion.div>

                  {/* Card 3: Data Protection */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setActiveTab('checklist')}
                    className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4.5 shadow-2xs hover:shadow-md transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <h2 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                      Data Protection
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Privacy, Cybersecurity
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        In Progress
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </motion.div>

                  {/* Card 4: Environmental */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setActiveTab('checklist')}
                    className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4.5 shadow-2xs hover:shadow-md transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <Leaf className="h-5 w-5" />
                      </div>
                    </div>
                    <h2 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                      Environmental
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ESG, Pollution Norms
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-cyan-950/60 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-cyan-400">
                        At Risk
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </motion.div>
                </div>

                {/* 3. UPCOMING COMPLIANCE TASKS TABLE (Matching Image 2) */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Upcoming Compliance Tasks
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('checklist')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    >
                      View All
                    </button>
                  </div>

                  {/* Task Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 pl-2">Task / Requirement</th>
                          <th className="pb-3 px-3">Category</th>
                          <th className="pb-3 px-3">Due Date</th>
                          <th className="pb-3 px-3">Status</th>
                          <th className="pb-3 pr-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                        {filteredTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                            <td className="py-3.5 pl-2">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  <FileText className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {task.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-bold ${task.categoryColor}`}>
                                {task.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                              {task.dueDate}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${task.statusColor}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedTaskModal(task)}
                                className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. BOTTOM FOUR QUICK STAT CARDS (Matching Image 2 with subtle hover) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Stat 1 */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-2xs"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Documents Verified</p>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">86 / 92</p>
                    </div>
                  </motion.div>

                  {/* Stat 2 */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-2xs"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Active Regulations</p>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">12</p>
                    </div>
                  </motion.div>

                  {/* Stat 3 */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-2xs"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pending Approvals</p>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">4</p>
                    </div>
                  </motion.div>

                  {/* Stat 4 */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-2xs"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-cyan-950/60 text-rose-600 dark:text-cyan-400">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Risk Flags</p>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">2</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT SIDEBAR COLUMN (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. COMPLIANCE READINESS SCORE CIRCULAR PROGRESS RING WIDGET */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Compliance Readiness Score
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Dynamic statutory evaluation
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-3 w-3 text-blue-500" />
                      Dynamic
                    </span>
                  </div>

                  {/* Circular Progress Ring */}
                  <div className="my-3 flex flex-col items-center justify-center">
                    <CircularProgressRing
                      score={stats.readinessScore}
                      size={144}
                      strokeWidth={11}
                      label="Readiness"
                      stageLabel={matrix.breakdown?.readinessStage || (stats.readinessScore >= 80 ? 'Operationally Ready' : stats.readinessScore >= 50 ? 'Foundation Set' : 'Formation Planning')}
                      riskTier={matrix.readinessBreakdown?.riskTier}
                      showPill={true}
                    />
                  </div>

                  {/* Live Breakdown Legend */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs font-medium">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                        Completed Check-offs
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {stats.completed} <span className="text-[10px] font-normal text-slate-400">/ {stats.total}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
                        In Progress
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {stats.inProgress}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />
                        Pending Action
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {stats.pending}
                        {stats.overdue > 0 ? (
                          <span className="text-[10px] font-bold text-rose-500 ml-1">
                            ({stats.overdue} mandatory)
                          </span>
                        ) : null}
                      </span>
                    </div>

                    {stats.waived > 0 && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-400 ring-2 ring-slate-400/20" />
                          Exempt / Waived
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {stats.waived}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Dynamic Prompt */}
                  <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800/80">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Check off obligations or update their status in your Phased Roadmap below to dynamically increase your readiness score.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('roadmap-canvas-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          setActiveTab('checklist');
                        }
                      }}
                      className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition"
                    >
                      <span>Check Off Roadmap Items</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. RECENT ACTIVITY STREAM (Matching Image 2) */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recent Activity
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('checklist')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Activity 1 */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">GST Return Filed</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">GSTR-3B for Aug 2025</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">2 hours ago</span>
                    </div>

                    {/* Activity 2 */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">Compliance Document Uploaded</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Environmental Clearance</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">4 hours ago</span>
                    </div>

                    {/* Activity 3 */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">License Renewal Due</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Factory License</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">1 day ago</span>
                    </div>

                    {/* Activity 4 */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">Policy Updated</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Data Privacy Policy v2.1</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">1 day ago</span>
                    </div>

                    {/* Activity 5 */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">Audit Report Generated</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Internal Compliance Audit</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">2 days ago</span>
                    </div>
                  </div>
                </div>

                {/* 3. PROMO CARD (Matching Image 2) */}
                <div className="relative overflow-hidden rounded-3xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-[#0E1A38] dark:to-slate-900 p-6 shadow-2xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Compliance Made Simple
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    Automate, track and stay compliant with all business regulations.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAIDesk}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#091024] hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold shadow-md transition active:scale-95"
                  >
                    <span>Explore Features</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Sub-view: Compliance Checklist (Integrated Statutory Engine) */}
        {activeTab === 'checklist' && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Compliance Checklist & Statutory Roadmap
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profile.businessName} • {profile.entityType} • {profile.state}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExportCSV}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={onOpenDossier}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition"
                >
                  Print Dossier
                </button>
              </div>
            </div>

            <RoadmapCanvas
              items={items}
              businessName={profile.businessName}
              onStatusChange={onStatusChange}
              onAskAIAboutItem={onAskAIAboutItem}
            />
          </main>
        )}

        {/* Sub-view: Regulations */}
        {activeTab === 'regulations' && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Active Corporate & Statutory Regulations
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Governing acts and statutory codes mapped to {profile.entityType} in {profile.state}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 mb-2">
                  <FileText className="h-5 w-5" />
                  <h2 className="text-sm font-bold">Companies Act, 2013</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Enforces corporate governance, annual returns (AOC-4, MGT-7), DIR-3 KYC, and statutory auditor appointment (ADT-1).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 mb-2">
                  <Landmark className="h-5 w-5" />
                  <h2 className="text-sm font-bold">Income Tax Act, 1961</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Governs corporate advance tax installments (Sec 208-211), TDS quarterly statements (24Q/26Q), and transfer pricing rules.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
                  <Scale className="h-5 w-5" />
                  <h2 className="text-sm font-bold">CGST & SGST Acts, 2017</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Monthly GSTR-1, GSTR-3B filings, e-invoicing for B2B thresholds, and annual reconciliation under GSTR-9.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="text-sm font-bold">Digital Personal Data Protection Act 2023</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Mandates purpose limitation, explicit consent collection, privacy notices, and data principal right fulfillment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 mb-2">
                  <Clock className="h-5 w-5" />
                  <h2 className="text-sm font-bold">EPF & ESI Acts, 1952/1948</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Mandatory contributions for enterprises crossing headcount thresholds. Monthly return filings by the 15th.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-rose-600 dark:text-cyan-400 mb-2">
                  <Leaf className="h-5 w-5" />
                  <h2 className="text-sm font-bold">State Pollution Control Acts</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Consent to Establish (CTE) & Consent to Operate (CTO) along with e-waste management authorization filings.
                </p>
              </div>
            </div>
          </main>
        )}

        {/* Sub-view: Alerts */}
        {activeTab === 'alerts' && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Statutory Notifications & Penalty Alerts
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Critical deadlines requiring immediate director or finance attention
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-rose-200 dark:border-cyan-800/60 bg-rose-50/50 dark:bg-cyan-950/30 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 dark:bg-cyan-600 text-white shadow-xs">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-rose-900 dark:text-cyan-200">
                      Income Tax Annual Return (ITR-6) Overdue
                    </h2>
                    <span className="text-[11px] font-bold text-rose-600 dark:text-cyan-400">Overdue by 3 days</span>
                  </div>
                  <p className="mt-1 text-xs text-rose-800 dark:text-cyan-300">
                    Statutory deadline was 15 Sep 2025. Failure to file incurs fee under Sec 234F plus 1% per month interest under Sec 234A.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                      Factory License Renewal Due in 11 Days
                    </h2>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Due 20 Sep 2025</span>
                  </div>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-300">
                    Renewal application with updated worker registers must be submitted online to avoid factory inspection notices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Data Protection Impact Assessment (DPIA) Required
                    </h2>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Due 25 Sep 2025</span>
                  </div>
                  <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                    Your profile indicates customer personal data processing. Formulate and archive DPIA documentation for audit readiness.
                  </p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Sub-view: Settings */}
        {activeTab === 'settings' && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Corporate Parameter Studio
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your entity type, headcount, cross-border flows, and state to dynamically re-evaluate compliance rules
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenWizard}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition"
              >
                Launch Setup Wizard
              </button>
            </div>

            <div className="max-w-3xl">
              <ParameterStudio profile={profile} onChange={onProfileChange} />
            </div>
          </main>
        )}
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedTaskModal.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedTaskModal.authority}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTaskModal(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Category</span>
                    <span className="font-bold text-slate-800 dark:text-white">{selectedTaskModal.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Due Date</span>
                    <span className="font-bold text-slate-800 dark:text-white font-mono">{selectedTaskModal.dueDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Statutory Guidance & Details:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {selectedTaskModal.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTaskModal(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTaskModal(null);
                    setActiveTab('checklist');
                  }}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition"
                >
                  Go to Checklist Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
