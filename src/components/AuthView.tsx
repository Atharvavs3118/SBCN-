import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  FileCheck,
  TrendingUp,
  Cloud,
  Check,
  Scale,
  Leaf,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface AuthViewProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onBackToLanding }) => {
  const { isDark, t, loginAsFounder } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [email, setEmail] = useState('atharvasankhe004@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Atharva Sankhe');
  const [companyName, setCompanyName] = useState('Vanguard Technologies');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsFounder(email, fullName);
    onSuccess();
  };

  const handleQuickDemo = () => {
    loginAsFounder('atharvasankhe004@gmail.com', 'Atharva Sankhe');
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#080D1D] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200"
    >
      {/* ============================================================ */}
      {/* LEFT COLUMN: HERO SHOWCASE (Clean, Minimal, Animated)       */}
      {/* ============================================================ */}
      <div className="relative flex-1 lg:w-[58%] xl:w-[60%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-radial from-[#0F1E3D] via-[#091024] to-[#060A17]">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        
        {/* Subtle grid lines background overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 1. Header Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Minimal Logo Shield */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                SBCN
              </div>
              <p className="text-[11px] font-normal text-slate-400">
                Smart Business Compliance Navigation
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button 
              type="button" 
              onClick={onBackToLanding}
              className="text-white hover:text-blue-400 transition"
            >
              Home
            </button>
            <button 
              type="button" 
              onClick={onBackToLanding}
              className="text-slate-400 hover:text-white transition"
            >
              Features
            </button>
            <button 
              type="button" 
              onClick={onBackToLanding}
              className="text-slate-400 hover:text-white transition"
            >
              Pricing
            </button>
            <button 
              type="button" 
              onClick={onBackToLanding}
              className="text-slate-400 hover:text-white transition"
            >
              About
            </button>
          </nav>
        </motion.div>

        {/* 2. Central Hero Content */}
        <div className="relative z-10 my-8 lg:my-10 max-w-2xl">
          {/* Minimal Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md shadow-xs mb-5"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Stay Compliant • Grow Confident</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            Simplify Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
              Business Compliance
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl font-normal"
          >
            Track, manage and meet your regulatory requirements with ease. SBCN helps businesses stay compliant, reduce risk and focus on what matters most — growth.
          </motion.p>

          {/* 4 Feature Points Grid */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5"
          >
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 backdrop-blur-xs transition hover:border-slate-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30">
                <FileCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">All-in-One Compliance</h2>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                  Manage tax, legal, data protection, environmental and more in one place.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 backdrop-blur-xs transition hover:border-slate-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Stay Updated</h2>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                  Get real-time alerts on regulatory changes and filing deadlines.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 backdrop-blur-xs transition hover:border-slate-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Reduce Risk</h2>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                  Automated checks and smart tracking keep you audit-ready.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 backdrop-blur-xs transition hover:border-slate-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30">
                <Cloud className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Work Anywhere</h2>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                  Access your compliance dashboard from any device, anytime.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* 3. Interactive Floating Laptop / Dashboard 3D Showcase Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mt-8 rounded-2xl border border-blue-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070c1a] p-4 sm:p-5 shadow-2xl shadow-blue-950/60 overflow-hidden"
          >
            {/* Top Mockup Browser Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[11px] font-medium text-slate-400">SBCN</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ● Live Sync Active
              </span>
            </div>

            {/* Inner Dashboard Miniature Preview */}
            <div className="mt-3 grid grid-cols-12 gap-3 items-center">
              {/* Left Miniature Controls */}
              <div className="col-span-8 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 rounded bg-blue-600 flex items-center justify-center text-[10px] font-semibold text-white">
                    Dashboard
                  </div>
                  <div className="h-6 w-16 rounded bg-slate-800/80 flex items-center justify-center text-[10px] text-slate-400">
                    Roadmap
                  </div>
                  <div className="h-6 w-16 rounded bg-slate-800/80 flex items-center justify-center text-[10px] text-slate-400">
                    Vault
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2 text-center">
                    <p className="text-[10px] text-slate-400">Regulations</p>
                    <p className="text-base font-bold text-white">24</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2 text-center">
                    <p className="text-[10px] text-slate-400">Completed</p>
                    <p className="text-base font-bold text-emerald-400">18</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2 text-center">
                    <p className="text-[10px] text-slate-400">Pending</p>
                    <p className="text-base font-bold text-amber-400">2</p>
                  </div>
                </div>

                {/* Miniature task rows */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded bg-slate-900/60 px-2 py-1 text-[10px] text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Check className="h-3 w-3 text-emerald-400" /> MCA Annual Filing SPICe+
                    </span>
                    <span className="text-emerald-400 font-semibold">Done</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-slate-900/60 px-2 py-1 text-[10px] text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Check className="h-3 w-3 text-emerald-400" /> GST GSTR-3B Tax Return
                    </span>
                    <span className="text-emerald-400 font-semibold">Done</span>
                  </div>
                </div>
              </div>

              {/* Right Miniature Donut */}
              <div className="col-span-4 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="relative flex items-center justify-center h-16 w-16">
                  {/* Circular SVG Donut */}
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400 transition-all duration-1000 ease-out"
                      strokeDasharray="92, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-bold text-white">92%</span>
                  </div>
                </div>
                <span className="mt-1 text-[10px] font-semibold text-emerald-400">On Track</span>
                <span className="text-[9px] text-slate-400">Overall Rate</span>
              </div>
            </div>

            {/* Badges */}
            <div className="hidden sm:flex items-center justify-around mt-4 pt-3 border-t border-slate-800/60 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span>MCA Corporate Law</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Scale className="h-3.5 w-3.5 text-purple-400" />
                <span>Tax & GST</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                <span>Environmental ESG</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                <span>DPDP Privacy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. Bottom Social Proof */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 font-normal">
            Trusted by growing businesses worldwide
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-6 sm:gap-10 text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <span className="h-2.5 w-2.5 rounded-xs bg-blue-500" /> TechNova
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> BrightCore
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <span className="h-2.5 w-2.5 rotate-45 rounded-xs bg-cyan-400" /> HelixData
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <span className="h-2.5 w-2.5 rounded-full border border-emerald-400" /> Veridian
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: LOGIN CARD (Clean, Simple, Clear Typography)  */}
      {/* ============================================================ */}
      <div className="flex-1 lg:w-[42%] xl:w-[40%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#090D1A] text-slate-900 dark:text-white transition-colors duration-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4">
          <button
            id="auth-back-button"
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <ThemeToggle showLabel={false} />
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="my-auto mx-auto w-full max-w-md py-6"
        >
          {/* Logo Emblem inside Card */}
          <div className="text-center mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mx-auto inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-50 dark:ring-blue-950/50 mb-3"
            >
              <ShieldCheck className="h-7 w-7 text-white" />
            </motion.div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              SBCN
            </div>
            <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
              Smart Business Compliance Navigation
            </p>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal">
              {isRegister
                ? 'Get started with automated statutory compliance'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Main Auth Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Full Name */}
                <div>
                  <label 
                    htmlFor="register-fullname"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="register-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Atharva Sankhe"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 py-2.5 pl-10 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label 
                    htmlFor="register-company"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="register-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Vanguard Technologies"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 py-2.5 pl-10 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label 
                htmlFor="login-email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 py-2.5 pl-10 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="login-password"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 py-2.5 pl-10 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {!isRegister && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email address.')}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary Submit Button */}
            <motion.button
              id="auth-submit-button"
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <span>{isRegister ? 'Create Account' : 'Login'}</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="absolute bg-white dark:bg-[#090D1A] px-3 text-[11px] font-normal text-slate-400 uppercase tracking-wider">
                or
              </span>
            </div>

            {/* Continue with Google Button */}
            <motion.button
              id="auth-google-button"
              type="button"
              onClick={handleQuickDemo}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.985 }}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs transition cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </motion.button>

            {/* Quick Demo Founder Shortcut */}
            <button
              id="auth-quick-demo-button"
              type="button"
              onClick={handleQuickDemo}
              className="w-full text-center text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition py-1 cursor-pointer"
            >
              Demo: Sign in directly as Atharva Sankhe (Business Admin)
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400 ml-1 cursor-pointer"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400 ml-1 cursor-pointer"
                >
                  Register
                </button>
              </p>
            )}
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          © 2026 SBCN • Smart Business Compliance Navigation
        </div>
      </div>
    </motion.div>
  );
};
