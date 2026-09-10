import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileCheck2,
  Upload,
  AlertTriangle,
  Search,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Globe,
  RefreshCw,
  FileText,
  Lock,
  Eye,
  Check,
  XCircle,
  Briefcase,
  Layers,
  FileBadge,
} from 'lucide-react';
import { ProfileState, ComplianceStatus } from '../types';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { db, auth, doc, setDoc } from '../lib/firebase';

interface ChecklistPageProps {
  profile: ProfileState;
  onProfileChange: (updated: Partial<ProfileState>) => void;
  onProceedToDashboard: () => void;
  onViewProfile: () => void;
}

// Government Portals tailored to State & Sector
function getRegulatoryPortals(state: string, sector: string) {
  const isKarnataka = state.toLowerCase().includes('karnataka');
  const isMaharashtra = state.toLowerCase().includes('maharashtra');
  const isDelhi = state.toLowerCase().includes('delhi');
  const isGujarat = state.toLowerCase().includes('gujarat');

  const portals = [
    {
      name: 'Ministry of Corporate Affairs (MCA21)',
      url: 'https://www.mca.gov.in',
      desc: 'Central registry for SPICe+ Part A & B incorporation, DIN allotment, and RUN name approval.',
      level: 'Central Government',
      badge: 'Mandatory',
    },
    {
      name: 'Goods & Services Tax (GSTN Portal)',
      url: 'https://www.gst.gov.in',
      desc: 'Registration for GSTIN under CGST/SGST Act 2017 and Form GST REG-01.',
      level: 'National Indirect Tax',
      badge: 'Tax Authority',
    },
    {
      name: 'Udyam Registration (Ministry of MSME)',
      url: 'https://udyamregistration.gov.in',
      desc: 'Free statutory MSME certification for priority sector lending, collateral-free credit, and subsidy schemes.',
      level: 'Ministry of MSME',
      badge: 'Statutory Benefit',
    },
  ];

  // State-specific portals
  if (isKarnataka) {
    portals.push(
      {
        name: 'e-Karmika Karnataka (Labour Dept)',
        url: 'https://ekarmika.karnataka.gov.in',
        desc: 'Registration of Commercial Establishments and Shops under Karnataka Shops and Commercial Establishments Act 1961.',
        level: 'Govt of Karnataka',
        badge: 'State Portal',
      },
      {
        name: 'Karnataka Commercial Taxes (e-Prerana)',
        url: 'https://commercialtax.kar.nic.in',
        desc: 'Professional Tax (PT) enrollment (EC) and registration (RC) for Karnataka employers.',
        level: 'Govt of Karnataka',
        badge: 'State Tax',
      }
    );
  } else if (isMaharashtra) {
    portals.push(
      {
        name: 'Aaple Sarkar Maharashtra Single Window',
        url: 'https://aaplesarkar.mahaonline.gov.in',
        desc: 'Single Window Clearance for Gumasta License (Shop & Establishment) and municipal certificates.',
        level: 'Govt of Maharashtra',
        badge: 'State Portal',
      },
      {
        name: 'MahaGST Portal',
        url: 'https://mahagst.gov.in',
        desc: 'Maharashtra Professional Tax (PTEC & PTRC) enrollment and compliance gateway.',
        level: 'Govt of Maharashtra',
        badge: 'State Tax',
      }
    );
  } else if (isDelhi) {
    portals.push({
      name: 'Delhi Labour Department Portal',
      url: 'https://labour.delhi.gov.in',
      desc: 'Registration under Delhi Shops and Establishments Act 1954.',
      level: 'Govt of NCT Delhi',
      badge: 'State Portal',
    });
  } else if (isGujarat) {
    portals.push({
      name: 'Investor Facilitation Portal (IFP Gujarat)',
      url: 'https://ifp.gujarat.gov.in',
      desc: 'Single window clearance for industrial and commercial establishments in Gujarat.',
      level: 'Govt of Gujarat',
      badge: 'State Portal',
    });
  }

  // Sector-specific portals
  if (sector === 'F&B / Hospitality') {
    portals.push({
      name: 'FoSCoS - FSSAI Food Licensing Authority',
      url: 'https://foscos.fssai.gov.in',
      desc: 'Mandatory Food Safety License / Registration for cloud kitchens, restaurants, and food operators.',
      level: 'FSSAI Central / State',
      badge: 'Sector Mandatory',
    });
  } else if (sector === 'Light Manufacturing') {
    portals.push(
      {
        name: 'State Pollution Control Board (OCMMS Portal)',
        url: 'https://cpcb.nic.in',
        desc: 'Consent to Establish (CTE) & Consent to Operate (CTO) under Air & Water Pollution Acts.',
        level: 'Pollution Control Board',
        badge: 'Environmental',
      },
      {
        name: 'Directorate of Industrial Safety & Health (DISH)',
        url: 'https://dish.gov.in',
        desc: 'Factory License approval under Factories Act 1948 for power and plant safety.',
        level: 'Labour & Safety',
        badge: 'Safety Inspection',
      }
    );
  } else if (sector === 'SaaS & Cloud Software') {
    portals.push(
      {
        name: 'ICEGATE & DGFT Export Portal',
        url: 'https://www.dgft.gov.in',
        desc: 'Importer Exporter Code (IEC) and Letter of Undertaking (LUT RFD-11) for 0% zero-rated service export.',
        level: 'Ministry of Commerce',
        badge: 'Zero-Rated Export',
      },
      {
        name: 'STPI / SOFTEX Export Declaration',
        url: 'https://www.stpi.in',
        desc: 'Statutory software export declaration for foreign exchange repatriation compliance.',
        level: 'Ministry of Electronics & IT',
        badge: 'Foreign Exchange',
      }
    );
  } else if (sector === 'Retail & E-Commerce') {
    portals.push({
      name: 'Legal Metrology Packaging Portal',
      url: 'https://consumeraffairs.nic.in',
      desc: 'Packaged Commodities Rules (LMPC) certification for pre-packed consumer goods.',
      level: 'Ministry of Consumer Affairs',
      badge: 'Packaging Law',
    });
  }

  return portals;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({
  profile,
  onProfileChange,
  onProceedToDashboard,
  onViewProfile,
}) => {
  const { isDark } = useApp();
  const [activeCheckpoint, setActiveCheckpoint] = useState<1 | 2 | 3 | 4>(1);

  // Checkpoint 1: Profile & Logo state
  const [logoPreview, setLogoPreview] = useState<string>(profile.logoUrl || '');
  const [businessName, setBusinessName] = useState(profile.businessName || 'Vanguard Technologies');
  const [selectedMonogram, setSelectedMonogram] = useState('Shield');

  // Checkpoint 2: Application of Certificates state
  const [certStatuses, setCertStatuses] = useState<Record<string, { status: string; refNumber: string }>>({
    gst: { status: profile.gstVerified ? 'Granted / Active' : 'Application in Progress', refNumber: profile.gstNumber || '' },
    udyam: { status: 'Granted / Active', refNumber: 'UDYAM-KR-03-0098712' },
    shopAct: { status: 'Application in Progress', refNumber: 'BLR/KA/2026/9421' },
    panTan: { status: 'Granted / Active', refNumber: 'BLRV09124K' },
    pTax: { status: 'Not Started', refNumber: '' },
    sectorCert: { status: 'Application in Progress', refNumber: '' },
  });

  // Checkpoint 3: Operational Gateways state
  const [operationalGateways, setOperationalGateways] = useState({
    epfo: { enabled: true, status: 'Registered' },
    esic: { enabled: true, status: 'Registered' },
    bankKyc: { enabled: true, status: 'Verified' },
    dpiit: { enabled: true, status: 'Applied' },
    posh: { enabled: true, status: 'Charter Formed' },
    trademark: { enabled: false, status: 'Drafting' },
  });

  // Checkpoint 4: Real-time GST & Certificate Verification state
  const [gstInput, setGstInput] = useState(profile.gstNumber || '29ABCDE1234F1Z5');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateFileName, setCertificateFileName] = useState(profile.uploadedCertificateName || '');
  const [certificateBase64, setCertificateBase64] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(profile.gstVerificationData || null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const regulatoryPortals = getRegulatoryPortals(profile.state, profile.sector);

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        onProfileChange({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Certificate document file upload handler
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
      setCertificateFileName(file.name);
      onProfileChange({ uploadedCertificateName: file.name });

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCertificateBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Checkpoint 4: Call server-side Gemini 3.8 + Search Grounding for GSTIN Verification
  const handleVerifyGst = async () => {
    const cleanedGst = gstInput.trim().toUpperCase();
    if (!cleanedGst) {
      setVerificationError('Please enter a valid 15-digit Indian GSTIN number.');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await fetch('/api/verify-gst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gstNumber: cleanedGst,
          businessName: businessName,
          state: profile.state,
          sector: profile.sector,
          entityType: profile.entityType,
          certificateBase64: certificateBase64,
          certificateMimeType: certificateFile?.type || 'image/jpeg',
          certificateFileName: certificateFileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setVerificationResult(data);

      // Save to parent profile state
      onProfileChange({
        gstNumber: cleanedGst,
        gstVerified: data.isValid,
        gstVerificationData: data,
      });

      // Persist to Firebase Firestore if logged in
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const checklistRef = doc(db, 'users', currentUser.uid, 'checklists', 'active');
          await setDoc(
            checklistRef,
            {
              userId: currentUser.uid,
              businessName: businessName,
              logoUrl: logoPreview,
              sector: profile.sector,
              state: profile.state,
              city: profile.city,
              currentCheckpoint: 4,
              isCompleted: data.isValid,
              gstNumber: cleanedGst,
              gstVerified: data.isValid,
              gstVerificationDetails: JSON.stringify(data),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

          // Audit record
          const auditRef = doc(db, 'users', currentUser.uid, 'verifications', `gst_${Date.now()}`);
          await setDoc(auditRef, {
            userId: currentUser.uid,
            gstNumber: cleanedGst,
            businessName: businessName,
            isValid: data.isValid,
            riskLevel: data.riskLevel || 'LOW',
            auditSummary: data.summary || 'Statutory GST Verification',
            timestamp: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('[Firestore] Sync notice:', dbErr);
        }
      }
    } catch (err: any) {
      console.error('GST verification error:', err);
      setVerificationError('Verification encountered a network or server delay. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinishChecklist = () => {
    onProfileChange({
      businessName,
      logoUrl: logoPreview,
      checklistCompleted: true,
    });
    onProceedToDashboard();
  };

  const checkpoints = [
    { id: 1, title: 'Company Profile & Portals', desc: 'Identity, logo, location & statutory departments' },
    { id: 2, title: 'Certificate Applications', desc: 'GST, MSME, Municipal & Sector licenses' },
    { id: 3, title: 'Compliance Gateways', desc: 'EPFO, ESIC, Bank KYC, DPIIT & POSH' },
    { id: 4, title: 'AI GSTIN Verification', desc: 'Gemini 3.8 real-time search & anti-fraud check' },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#080D1A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition py-3.5 px-4 sm:px-8 flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-[#080D1A]/90' : 'border-slate-200 bg-white/95 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                SBCN Compliance Onboarding
              </span>
              <span className="rounded-md bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                Statutory Checklist
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {profile.businessName} • {profile.sector} • {profile.state}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onViewProfile}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-blue-500" />
            <span>View Profile</span>
          </button>

          <button
            onClick={handleFinishChecklist}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-600/20 transition cursor-pointer"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <LanguageSelector compact />
          <ThemeToggle showLabel={false} />
        </div>
      </header>

      {/* Stepper Bar */}
      <div
        className={`border-b py-3 px-4 sm:px-8 ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-100/70'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {checkpoints.map((cp) => {
              const isActive = activeCheckpoint === cp.id;
              const isPast = activeCheckpoint > cp.id || (cp.id === 4 && verificationResult?.isValid);
              return (
                <button
                  key={cp.id}
                  onClick={() => setActiveCheckpoint(cp.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'border-blue-500 bg-blue-950/40 text-blue-200 ring-1 ring-blue-500'
                        : 'border-blue-600 bg-blue-50/90 text-blue-950 ring-1 ring-blue-600 shadow-2xs'
                      : isPast
                      ? isDark
                        ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300'
                        : 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
                      : isDark
                      ? 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isPast ? <Check className="h-4 w-4" /> : cp.id}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{cp.title}</div>
                    <div className="text-[10px] opacity-75 truncate">{cp.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* CHECKPOINT 1: COMPANY PROFILE & GOVERNMENT REGULATORY PORTALS             */}
          {/* ========================================================================= */}
          {activeCheckpoint === 1 && (
            <motion.div
              key="cp1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Card 1: Enterprise Profile & Brand Logo */}
              <div
                className={`rounded-2xl border p-6 transition shadow-xs ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Checkpoint 1: Corporate Profile & Statutory Registry</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Enterprise Identity & Business Assets
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Verify your business name, corporate logo, location, and official regulatory portal links.
                    </p>
                  </div>

                  <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {profile.entityType}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
                  {/* Business Logo Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Company Brand Logo
                    </label>

                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center">
                      {logoPreview ? (
                        <div className="relative group">
                          <img
                            src={logoPreview}
                            alt="Company Logo"
                            className="h-24 w-24 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview('');
                              onProfileChange({ logoUrl: '' });
                            }}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center shadow-md cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl mb-2">
                            {businessName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Upload PNG/SVG logo or use system emblem
                          </span>
                        </div>
                      )}

                      <label className="mt-3 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Business Details Fields */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                          Registered Business Name
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => {
                            setBusinessName(e.target.value);
                            onProfileChange({ businessName: e.target.value });
                          }}
                          className="w-full rounded-xl border p-2.5 text-xs font-semibold border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                          Industry & Operating Sector
                        </label>
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{profile.sector}</span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Verified</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                          Registered State Jurisdiction
                        </label>
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 text-xs font-semibold text-slate-900 dark:text-white">
                          {profile.state}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                          Operating City / Municipality
                        </label>
                        <input
                          type="text"
                          value={profile.city || ''}
                          onChange={(e) => onProfileChange({ city: e.target.value })}
                          placeholder="e.g. Bengaluru / Mumbai / Pune"
                          className="w-full rounded-xl border p-2.5 text-xs font-semibold border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Local Jurisdiction Tier Selection */}
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Local Body & Jurisdiction Tier
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'Tier-1 Metro / Municipal Corporation', label: 'Tier-1 Metro City', note: 'Municipal Corp (BBMP, BMC, etc.)' },
                          { id: 'Small City / Municipality (Nagar Palika)', label: 'Small City / Town', note: 'Nagar Palika / Parishad' },
                          { id: 'Rural / Gram Panchayat', label: 'Rural / Gram Panchayat', note: 'Panchayati Raj Jurisdiction' },
                        ].map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => onProfileChange({ locationTier: tier.id as any })}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              (profile.locationTier || 'Tier-1 Metro / Municipal Corporation') === tier.id
                                ? isDark
                                  ? 'border-blue-500 bg-blue-950/40 text-blue-200 ring-1 ring-blue-500'
                                  : 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                                : isDark
                                ? 'border-slate-800 bg-slate-800/40 text-slate-300'
                                : 'border-slate-200 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{tier.label}</span>
                              {(profile.locationTier || 'Tier-1 Metro / Municipal Corporation') === tier.id && (
                                <Check className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{tier.note}</div>
                          </button>
                        ))}
                      </div>

                      {profile.locationTier === 'Rural / Gram Panchayat' && (
                        <div className="mt-2.5 p-2.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200">
                          <label className="block text-[11px] font-bold mb-1">Gram Panchayat / Village Name:</label>
                          <input
                            type="text"
                            value={profile.gramPanchayatName || ''}
                            onChange={(e) => onProfileChange({ gramPanchayatName: e.target.value })}
                            placeholder="e.g. Gram Panchayat Khed"
                            className="w-full rounded-md border p-1.5 text-xs bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-700 text-slate-900 dark:text-white"
                          />
                          <p className="text-[10px] mt-1 text-amber-800 dark:text-amber-300">
                            🌾 Gram Panchayat businesses obtain a local Trade NOC / Parwana under the Panchayati Raj Act and are exempt from metropolitan Municipal Corporation shop acts.
                          </p>
                        </div>
                      )}

                      {profile.locationTier === 'Small City / Municipality (Nagar Palika)' && (
                        <div className="mt-2.5 p-2.5 rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-xs text-blue-900 dark:text-blue-200">
                          <label className="block text-[11px] font-bold mb-1">Small City / Nagar Palika Name:</label>
                          <input
                            type="text"
                            value={profile.localBodyName || ''}
                            onChange={(e) => onProfileChange({ localBodyName: e.target.value })}
                            placeholder="e.g. Alwar Nagar Parishad"
                            className="w-full rounded-md border p-1.5 text-xs bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-700 text-slate-900 dark:text-white"
                          />
                          <p className="text-[10px] mt-1 text-blue-800 dark:text-blue-300">
                            🏛️ Streamlined registration and lower fees under the local municipality / town council regulations.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Statutory Summary for Selected Sector */}
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        isDark ? 'border-blue-900/50 bg-blue-950/20 text-blue-200' : 'border-blue-200 bg-blue-50 text-blue-950'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400">
                        <Award className="h-4 w-4" />
                        <span>Statutory Requirements for {profile.sector}:</span>
                      </div>
                      <div>
                        Based on your selection of <strong>{profile.sector}</strong> operating in{' '}
                        <strong>{profile.state}</strong> with structure <strong>{profile.entityType}</strong>, your mandatory certificates include GSTIN, Udyam MSME, Municipal Shop & Establishment, and sector-specific clearances.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Official Government Portals for Sector & State */}
              <div
                className={`rounded-2xl border p-6 transition shadow-xs ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-500" />
                      <span>Official Statutory Government Portals for Your Field</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Direct single-click access to authoritative Central and State government portals:
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {regulatoryPortals.length} Portals Mapped
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {regulatoryPortals.map((portal, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                        isDark ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {portal.name}
                          </div>
                          <span className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                            {portal.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {portal.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{portal.level}</span>
                        <a
                          href={portal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <span>Open Portal</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveCheckpoint(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition cursor-pointer"
                  >
                    <span>Save & Proceed to Checkpoint 2: Application of Certificates</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* CHECKPOINT 2: APPLICATION OF STATUTORY CERTIFICATES (GST, MSME, ETC.)    */}
          {/* ========================================================================= */}
          {activeCheckpoint === 2 && (
            <motion.div
              key="cp2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div
                className={`rounded-2xl border p-6 transition shadow-xs ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      <FileBadge className="h-3.5 w-3.5" />
                      <span>Checkpoint 2: Application of Mandatory Certificates</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Statutory Licenses, GSTIN & MSME Filings
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Track the filing status and ARN / Registration Numbers for key corporate identifiers.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCertStatuses((prev) => ({
                          ...prev,
                          gst: { status: prev.gst?.status || 'Application in Progress', refNumber: prev.gst?.refNumber || profile.gstNumber || '' },
                          udyam: { status: prev.udyam?.status || 'Granted / Active', refNumber: prev.udyam?.refNumber || 'UDYAM-MSME-APPLIED' },
                          shopAct: { status: 'Not Applicable (Small Business Exemption)', refNumber: 'N/A - EXEMPT' },
                          panTan: { status: prev.panTan?.status || 'Granted / Active', refNumber: prev.panTan?.refNumber || '' },
                          pTax: { status: 'Not Applicable (Small Business Exemption)', refNumber: 'N/A - EXEMPT' },
                          sectorCert: { status: 'Not Applicable (Small Business Exemption)', refNumber: 'N/A - EXEMPT' },
                        }));
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Small Business Mode (GSTIN + Udyam Only)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCertStatuses({
                          gst: { status: profile.gstVerified ? 'Granted / Active' : 'Application in Progress', refNumber: profile.gstNumber || '' },
                          udyam: { status: 'Granted / Active', refNumber: 'UDYAM-KR-03-0098712' },
                          shopAct: { status: 'Application in Progress', refNumber: 'BLR/KA/2026/9421' },
                          panTan: { status: 'Granted / Active', refNumber: 'BLRV09124K' },
                          pTax: { status: 'Not Started', refNumber: '' },
                          sectorCert: { status: 'Application in Progress', refNumber: '' },
                        });
                      }}
                      className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Standard All-Filings
                    </button>
                  </div>
                </div>

                {/* Small Business Advisory Banner */}
                <div className={`mt-4 rounded-xl border p-3 text-xs flex items-start gap-2.5 ${
                  isDark ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                }`}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Small Business Compliance Rule: </span>
                    Under Indian MSME and municipal provisions, small businesses and micro-enterprises primarily require only <strong>GSTIN</strong> and <strong>Udyam MSME</strong>. You can mark Shop Act, Professional Tax, or other sector permits as <em>"Not Applicable (Small Business Exemption)"</em> below without penalty.
                  </div>
                </div>

                {/* Certificate List */}
                <div className="divide-y divide-slate-200 dark:divide-slate-800 mt-4">
                  {[
                    {
                      key: 'gst',
                      title: 'Goods & Services Tax Identification Number (GSTIN)',
                      act: 'CGST & SGST Act 2017 | Form REG-01',
                      portalUrl: 'https://www.gst.gov.in',
                      tat: '3–5 Business Days',
                      mandatory: true,
                      canBeNA: false,
                      desc: 'Mandatory for interstate supply, e-commerce, and entities crossing ₹20L/₹40L threshold.',
                    },
                    {
                      key: 'udyam',
                      title: 'Udyam MSME Registration Certificate',
                      act: 'MSMED Act 2006 | Ministry of MSME',
                      portalUrl: 'https://udyamregistration.gov.in',
                      tat: 'Instant / 1 Day',
                      mandatory: true,
                      canBeNA: false,
                      desc: 'Enables 1% interest subvention, 80% patent fee rebate, and protection against delayed buyer payments under Section 15.',
                    },
                    {
                      key: 'shopAct',
                      title:
                        profile.locationTier === 'Rural / Gram Panchayat'
                          ? 'Gram Panchayat Trade NOC / Parwana (or Not Applicable)'
                          : profile.locationTier === 'Small City / Municipality (Nagar Palika)'
                          ? 'Small City Municipality / Nagar Palika Trade License'
                          : 'Shops & Commercial Establishments Act License / Trade License',
                      act:
                        profile.locationTier === 'Rural / Gram Panchayat'
                          ? `${profile.state} Panchayati Raj Act`
                          : `${profile.state} Shops & Establishments Act`,
                      portalUrl: regulatoryPortals[3]?.url || 'https://www.mca.gov.in',
                      tat: '5–7 Business Days',
                      mandatory: profile.locationTier !== 'Rural / Gram Panchayat',
                      canBeNA: true,
                      desc:
                        profile.locationTier === 'Rural / Gram Panchayat'
                          ? 'Gram Panchayat rural businesses are governed by the Panchayati Raj Act. Municipal Shop Act is NOT applicable; obtain village trade NOC or rely on Udyam.'
                          : 'Validates commercial business address and working hours. Small businesses with <5 employees in many states are exempt.',
                    },
                    {
                      key: 'panTan',
                      title: 'Permanent Account Number (PAN) & Tax Deduction Account (TAN)',
                      act: 'Income Tax Act 1961 | Central Board of Direct Taxes (CBDT)',
                      portalUrl: 'https://www.onlineservices.nsdl.com',
                      tat: 'Bundled with Incorporation',
                      mandatory: true,
                      canBeNA: false,
                      desc: 'Corporate tax identity and mandatory TAN for deducting Tax Deducted at Source (TDS) on contracts and payroll.',
                    },
                    {
                      key: 'pTax',
                      title: 'Professional Tax (PT-PTEC & PT-PTRC)',
                      act: `${profile.state} State Tax on Professions, Trades & Employments`,
                      portalUrl: regulatoryPortals[4]?.url || 'https://www.gst.gov.in',
                      tat: '3–4 Business Days',
                      mandatory: profile.exactHeadcount > 0,
                      canBeNA: true,
                      desc: 'PTEC for company director liability; PTRC for employer deducting monthly professional tax from staff salaries. Not applicable for zero-employee solo ventures.',
                    },
                    {
                      key: 'sectorCert',
                      title:
                        profile.sector === 'F&B / Hospitality'
                          ? 'FSSAI Food Safety License / Registration'
                          : profile.sector === 'Light Manufacturing'
                          ? 'Pollution Control CTE / CTO & Factory Act License'
                          : profile.sector === 'SaaS & Cloud Software'
                          ? 'Letter of Undertaking (LUT RFD-11) for 0% Export'
                          : 'Legal Metrology & Packaging Certificate (LMPC)',
                      act:
                        profile.sector === 'F&B / Hospitality'
                          ? 'Food Safety and Standards Act 2006'
                          : profile.sector === 'Light Manufacturing'
                          ? 'Air & Water Acts & Factories Act 1948'
                          : 'IGST Act 2017 Section 16 (Zero-Rated Supply)',
                      portalUrl:
                        profile.sector === 'F&B / Hospitality'
                          ? 'https://foscos.fssai.gov.in'
                          : profile.sector === 'Light Manufacturing'
                          ? 'https://cpcb.nic.in'
                          : 'https://www.gst.gov.in',
                      tat: '7–14 Business Days',
                      mandatory: false,
                      canBeNA: true,
                      desc: 'Sector-specific operating permit. Small businesses without exports or heavy equipment can mark as Not Applicable.',
                    },
                  ].map((cert) => {
                    const current = certStatuses[cert.key] || { status: 'Not Started', refNumber: '' };
                    const isNA = current.status === 'Not Applicable (Small Business Exemption)';

                    return (
                      <div key={cert.key} className={`py-4 space-y-2 ${isNA ? 'opacity-80' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-xs ${isNA ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                {cert.title}
                              </span>
                              {isNA ? (
                                <span className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-700 dark:text-slate-300">
                                  Not Applicable (Exempt)
                                </span>
                              ) : cert.mandatory ? (
                                <span className="rounded bg-rose-100 dark:bg-cyan-950 px-1.5 py-0.2 text-[9px] font-bold text-rose-700 dark:text-cyan-300">
                                  Mandatory
                                </span>
                              ) : (
                                <span className="rounded bg-blue-100 dark:bg-blue-950 px-1.5 py-0.2 text-[9px] font-bold text-blue-700 dark:text-blue-300">
                                  Optional / Conditional
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {cert.act} • Standard TAT: {cert.tat}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {cert.canBeNA && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (isNA) {
                                    setCertStatuses((prev) => ({
                                      ...prev,
                                      [cert.key]: { status: 'Application in Progress', refNumber: '' },
                                    }));
                                  } else {
                                    setCertStatuses((prev) => ({
                                      ...prev,
                                      [cert.key]: { status: 'Not Applicable (Small Business Exemption)', refNumber: 'N/A - EXEMPT' },
                                    }));
                                  }
                                }}
                                className={`text-[11px] font-semibold px-2 py-1 rounded transition cursor-pointer ${
                                  isNA
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                }`}
                              >
                                {isNA ? 'Set as Applicable' : 'Mark Not Applicable'}
                              </button>
                            )}

                            {!isNA && (
                              <a
                                href={cert.portalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                              >
                                <span>Apply on Portal</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300">{cert.desc}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-500 shrink-0">Status:</span>
                            <select
                              value={current.status}
                              onChange={(e) =>
                                setCertStatuses((prev) => ({
                                  ...prev,
                                  [cert.key]: {
                                    ...current,
                                    status: e.target.value,
                                    refNumber: e.target.value === 'Not Applicable (Small Business Exemption)' ? 'N/A - EXEMPT' : current.refNumber,
                                  },
                                }))
                              }
                              className="w-full text-xs font-semibold p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="Application in Progress">Application in Progress</option>
                              <option value="Under Scrutiny / Review">Under Scrutiny / Review</option>
                              <option value="Granted / Active">Granted / Active</option>
                              {cert.canBeNA && (
                                <option value="Not Applicable (Small Business Exemption)">
                                  Not Applicable (Small Business Exemption)
                                </option>
                              )}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-500 shrink-0">Ref / ARN:</span>
                            <input
                              type="text"
                              value={current.refNumber}
                              disabled={isNA}
                              onChange={(e) =>
                                setCertStatuses((prev) => ({
                                  ...prev,
                                  [cert.key]: { ...current, refNumber: e.target.value },
                                }))
                              }
                              placeholder={isNA ? 'Exempt under MSME provisions' : 'e.g. ARN-AA290226019842'}
                              className={`w-full text-xs font-semibold p-1.5 rounded-lg border ${
                                isNA
                                  ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
                                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <button
                    onClick={() => setActiveCheckpoint(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Checkpoint 1</span>
                  </button>

                  <button
                    onClick={() => setActiveCheckpoint(3)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition cursor-pointer"
                  >
                    <span>Proceed to Checkpoint 3: Operational Gateways</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* CHECKPOINT 3: OPERATIONAL & COMPLIANCE GATEWAYS (EPFO, ESIC, DPIIT, ETC.) */}
          {/* ========================================================================= */}
          {activeCheckpoint === 3 && (
            <motion.div
              key="cp3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div
                className={`rounded-2xl border p-6 transition shadow-xs ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Checkpoint 3: Operational & Statutory Compliance Gateways</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Labor Security, Bank KYC, & Governance Controls
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ensure workforce protections, commercial banking clearances, and intellectual property setups.
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    4 Gateways Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {[
                    {
                      id: 'epfo',
                      title: 'EPFO (Employees Provident Fund)',
                      authority: 'Ministry of Labour & Employment',
                      portal: 'https://unifiedportal-emp.epfindia.gov.in',
                      threshold: 'Mandatory at 20+ headcount (Voluntary for startups)',
                      details: '12% employer + 12% employee contribution. Deducted and remitted via ECR by 15th of each calendar month.',
                    },
                    {
                      id: 'esic',
                      title: 'ESIC (Employees State Insurance)',
                      authority: 'Ministry of Labour & Employment',
                      portal: 'https://www.esic.gov.in',
                      threshold: 'Mandatory at 10+ employees earning <= ₹21,000/mo',
                      details: '3.25% employer + 0.75% employee contribution. Full medical and social security shield.',
                    },
                    {
                      id: 'bankKyc',
                      title: 'Commercial Current Account & Form INC-20A',
                      authority: 'Reserve Bank of India & MCA',
                      portal: 'https://www.mca.gov.in',
                      threshold: 'Mandatory within 180 days of incorporation',
                      details: 'Founders must deposit share capital into company bank account and file Form INC-20A (Commencement of Business) signed by CA/CS.',
                    },
                    {
                      id: 'dpiit',
                      title: 'Startup India DPIIT Recognition & 80-IAC',
                      authority: 'Department for Promotion of Industry and Internal Trade',
                      portal: 'https://www.startupindia.gov.in',
                      threshold: 'Entities incorporated within 10 years',
                      details: 'Grants Section 80-IAC 3-consecutive year income tax holiday, angel tax exemption (Section 56(2)(viib)), and fast-track patents.',
                    },
                    {
                      id: 'posh',
                      title: 'POSH Statutory Internal Committee (IC)',
                      authority: 'Women & Child Development Ministry',
                      portal: 'https://www.wcd.nic.in',
                      threshold: 'Mandatory at 10+ employees',
                      details: 'Mandatory written POSH policy and 4-member Internal Committee headed by a senior woman employee plus an external NGO representative.',
                    },
                    {
                      id: 'trademark',
                      title: 'Trademark Application (Class 9, 35, 42)',
                      authority: 'Controller General of Patents, Designs & Trademarks',
                      portal: 'https://ipindiaonline.gov.in',
                      threshold: 'Recommended for Brand Identity Protection',
                      details: 'Form TM-A filing protects brand name, logo, and prevents competitors from squatting on your registered venture identity.',
                    },
                  ].map((gw) => (
                    <div
                      key={gw.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                        isDark ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {gw.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {gw.authority}
                          </span>
                        </div>
                        <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                          {gw.threshold}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {gw.details}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                        <a
                          href={gw.portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          <span>Open Government Gateway</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Enabled</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <button
                    onClick={() => setActiveCheckpoint(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Checkpoint 2</span>
                  </button>

                  <button
                    onClick={() => setActiveCheckpoint(4)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition cursor-pointer"
                  >
                    <span>Proceed to Checkpoint 4: AI GSTIN Verification</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* CHECKPOINT 4: DOCUMENT & GSTIN REAL-TIME VERIFICATION (GEMINI 3.8 SEARCH)  */}
          {/* ========================================================================= */}
          {activeCheckpoint === 4 && (
            <motion.div
              key="cp4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div
                className={`rounded-2xl border p-6 transition shadow-xs ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Checkpoint 4: Real-Time Statutory Anti-Fraud Verification</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Gemini 3.8 Real-Time Search & GSTIN Verification
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload your registration certificate and verify your GST number against official GSTN records and public registries in real time.
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    <span>Gemini 3.8 + Search Grounding</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  {/* Left Column: Input Form */}
                  <div className="space-y-4">
                    {/* GST Number Input */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        Goods & Services Tax Identification Number (GSTIN)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={gstInput}
                          maxLength={15}
                          onChange={(e) => setGstInput(e.target.value.toUpperCase())}
                          placeholder="e.g. 29ABCDE1234F1Z5"
                          className="w-full font-mono text-sm font-bold tracking-wider rounded-xl border p-3 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                          {gstInput.length}/15
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>Format: 2 state digits + 10 PAN chars + 1 entity + Z + 1 check digit</span>
                        <span className="font-mono">
                          State: {gstInput.slice(0, 2) === '29' ? 'Karnataka' : gstInput.slice(0, 2) === '27' ? 'Maharashtra' : gstInput.slice(0, 2) === '07' ? 'Delhi' : 'India'}
                        </span>
                      </div>
                    </div>

                    {/* Certificate Document Upload Zone */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        Statutory Certificate Document (REG-06 / Incorporation / Udyam)
                      </label>
                      <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center space-y-2">
                        {certificateFileName ? (
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 text-left">
                              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <div className="truncate">
                                <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate">
                                  {certificateFileName}
                                </div>
                                <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                  Ready for Gemini Document Verification
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCertificateFile(null);
                                setCertificateFileName('');
                                setCertificateBase64('');
                                onProfileChange({ uploadedCertificateName: '' });
                              }}
                              className="text-xs text-rose-500 hover:text-rose-700 px-2 font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Upload className="h-8 w-8 mx-auto text-slate-400" />
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Drag & drop certificate image or PDF
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Supports JPG, PNG, PDF up to 10MB
                            </div>
                          </div>
                        )}

                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer">
                          <span>{certificateFileName ? 'Change Document' : 'Browse File'}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleCertificateUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Trigger Verification Button */}
                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={handleVerifyGst}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Gemini 3.8 Real-Time Searching GSTN Records...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Verify GSTIN via Gemini 3.8 Real-Time Search</span>
                        </>
                      )}
                    </button>

                    {verificationError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-cyan-950/40 border border-rose-200 dark:border-cyan-800 text-xs text-rose-800 dark:text-cyan-300 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-cyan-400" />
                        <div>{verificationError}</div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Live Verification Results Card */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Anti-Fraud Audit & Verification Status
                    </div>

                    {verificationResult ? (
                      <div
                        className={`rounded-xl border p-4 space-y-4 transition ${
                          verificationResult.isValid
                            ? isDark
                              ? 'border-emerald-800/80 bg-emerald-950/20'
                              : 'border-emerald-200 bg-emerald-50/70'
                            : isDark
                            ? 'border-cyan-800/80 bg-cyan-950/30'
                            : 'border-rose-200 bg-rose-50/80'
                        }`}
                      >
                        {/* Header Status Banner */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {verificationResult.isValid ? (
                              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-lg bg-rose-600 dark:bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <XCircle className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">
                                {verificationResult.isValid ? 'Statutory Registration Verified' : 'Fraud Alert: Invalid / Unregistered Entity'}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Status: {verificationResult.status || 'Active'} • Risk: {verificationResult.riskLevel || 'Low'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                                verificationResult.isValid
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                  : 'bg-rose-100 text-rose-800 dark:bg-cyan-950 dark:text-cyan-200'
                              }`}
                            >
                              {verificationResult.confidenceScore || 95}% Match
                            </span>
                          </div>
                        </div>

                        {/* Details Table */}
                        <div className="text-xs space-y-2 border-t border-b border-slate-200 dark:border-slate-800 py-3">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Legal Name:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {verificationResult.legalName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Jurisdiction State:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {verificationResult.state} (Code: {verificationResult.stateCode})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Taxpayer Category:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {verificationResult.taxpayerType || 'Regular Taxpayer'}
                            </span>
                          </div>
                          {verificationResult.certificateCheck && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Document Seal:</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {verificationResult.certificateCheck.remarks || 'Verified'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Executive Summary */}
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {verificationResult.summary}
                        </p>

                        {/* Grounding Sources */}
                        {verificationResult.sources && verificationResult.sources.length > 0 && (
                          <div className="text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                            <span className="font-bold text-slate-500">Real-Time Registry Sources: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {verificationResult.sources.map((src: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <span>{src.title}</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                        <Search className="h-8 w-8 mx-auto text-slate-400" />
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Awaiting Verification Trigger
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                          Enter your 15-digit GSTIN and click "Verify GSTIN" to launch real-time Gemini 3.8 web search grounding to protect against fraudulent business profiles.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    onClick={() => setActiveCheckpoint(3)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Checkpoint 3</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={onViewProfile}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                        isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      View Business Profile
                    </button>

                    <button
                      onClick={handleFinishChecklist}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                    >
                      <span>Complete Checklist & Open Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
