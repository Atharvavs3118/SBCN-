/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { BusinessSetupWizard } from './components/BusinessSetupWizard';
import { TopNavbar } from './components/TopNavbar';
import { ExposureMatrixHeader } from './components/ExposureMatrixHeader';
import { ParameterStudio } from './components/ParameterStudio';
import { RoadmapCanvas } from './components/RoadmapCanvas';
import { ComplyProDashboard } from './components/ComplyProDashboard';
import { AuraIntelligenceDesk } from './components/AuraIntelligenceDesk';
import { DocumentAuditorModal } from './components/DocumentAuditorModal';
import { ExecutiveDossierModal } from './components/ExecutiveDossierModal';
import { ChecklistPage } from './components/ChecklistPage';
import { ProfileView } from './components/ProfileView';
import { ProfileState, ComplianceItem, ComplianceStatus } from './types';
import {
  evaluateComplianceRoadmap,
  PRESET_COMPANY_PROFILES,
} from './rules/deterministicEngine';
import { exportComplianceRoadmapToCSV } from './utils/csvExport';

const STORAGE_KEY_PROFILE = 'aura_compliance_profile_v1';
const STORAGE_KEY_STATUSES = 'aura_compliance_statuses_v1';

const DEFAULT_PROFILE: ProfileState = {
  businessName: 'Vanguard AI Technologies',
  entityType: 'Private Limited',
  sector: 'SaaS & Cloud Software',
  headcountTier: '10–19',
  exactHeadcount: 14,
  revenueThreshold: '₹40L–₹1.5Cr',
  footprint: 'Remote / Virtual Office',
  crossBorder: 'Export Services (SaaS / Global Tech)',
  state: 'Karnataka (Bengaluru)',
  city: 'Bengaluru',
  hasOnlineDelivery: false,
  onlineDeliveryModel: 'None',
  hasImportExport: true,
  importExportType: 'Export of Services (SaaS / Tech / Consulting)',
  incorporationStatus: 'Pre-Incorporation / Planning',
  handlingFood: false,
  handlingEffluentOrPollution: false,
  takesForeignCapital: true,
  handlingCustomerPersonalData: true,
};

function AppInner() {
  const { currentView, setCurrentView } = useApp();

  // Load persisted profile or default
  const [profile, setProfile] = useState<ProfileState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved profile', e);
    }
    return DEFAULT_PROFILE;
  });

  // Load user status check-offs
  const [itemStatuses, setItemStatuses] = useState<Record<string, ComplianceStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATUSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved statuses', e);
    }
    return {
      mca_dsc: 'Completed',
      mca_name_approval: 'Completed',
      mca_incorporation_spice: 'Completed',
      it_pan_tan: 'Completed',
    };
  });

  // Modals & Assistant Drawers
  const [isAuditorOpen, setIsAuditorOpen] = useState(false);
  const [isAIDeskOpen, setIsAIDeskOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedItemForAI, setSelectedItemForAI] = useState<ComplianceItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(itemStatuses));
    } catch (e) {
      console.error('Failed to save statuses', e);
    }
  }, [itemStatuses]);

  // Real-time evaluation of items & exposure matrix
  const { items, matrix } = useMemo(() => {
    return evaluateComplianceRoadmap(profile, itemStatuses);
  }, [profile, itemStatuses]);

  const handleProfileChange = (updated: Partial<ProfileState>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectPreset = (presetKey: string) => {
    const preset = PRESET_COMPANY_PROFILES[presetKey];
    if (preset) {
      setProfile((prev) => ({
        ...prev,
        ...preset,
      }));
    }
  };

  const handleStatusChange = (itemId: string, status: ComplianceStatus) => {
    setItemStatuses((prev) => ({
      ...prev,
      [itemId]: status,
    }));
  };

  const handleAskAIAboutItem = (item: ComplianceItem) => {
    setSelectedItemForAI(item);
    setIsAIDeskOpen(true);
  };

  const handleJumpToPending = () => {
    const canvasElement = document.getElementById('roadmap-canvas-section');
    if (canvasElement) {
      canvasElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    exportComplianceRoadmapToCSV(items, profile.businessName);
  };

  // 1. First: The Landing page will open
  if (currentView === 'LANDING') {
    return (
      <LandingPage
        onGoToLogin={() => setCurrentView('LOGIN')}
      />
    );
  }

  // 2. The redirect to login page on any button leaving 'how it works' button
  if (currentView === 'LOGIN') {
    return (
      <AuthView
        onSuccess={() => setCurrentView('WIZARD')}
        onBackToLanding={() => setCurrentView('LANDING')}
      />
    );
  }

  // 3. Then it will ask all questions like what business/startup, Pvt Ltd or LLP, legal identity, etc.
  if (currentView === 'WIZARD') {
    return (
      <BusinessSetupWizard
        initialProfile={profile}
        onComplete={(newProfile) => {
          setProfile(newProfile);
          setCurrentView('CHECKLIST');
        }}
        onSkip={() => setCurrentView('CHECKLIST')}
      />
    );
  }

  // 4. Then goes to Checklist page with 4 Checkpoints and Gemini 3.8 real-time verification
  if (currentView === 'CHECKLIST') {
    return (
      <ChecklistPage
        profile={profile}
        onProfileChange={handleProfileChange}
        onProceedToDashboard={() => setCurrentView('DASHBOARD')}
        onViewProfile={() => setCurrentView('PROFILE')}
      />
    );
  }

  // 5. Business Profile Dossier Page
  if (currentView === 'PROFILE') {
    return (
      <ProfileView
        profile={profile}
        onProfileChange={handleProfileChange}
        onBackToChecklist={() => setCurrentView('CHECKLIST')}
        onGoToDashboard={() => setCurrentView('DASHBOARD')}
      />
    );
  }

  // 6. Full Navigator Dashboard View
  return (
    <div className="min-h-screen transition-colors duration-200 bg-[#F4F7FC] dark:bg-[#070C18] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600/20 selection:text-blue-600">
      {/* ComplyPro Enterprise Dashboard matching Image 2 */}
      <ComplyProDashboard
        profile={profile}
        onProfileChange={handleProfileChange}
        items={items}
        matrix={matrix}
        onStatusChange={handleStatusChange}
        onAskAIAboutItem={handleAskAIAboutItem}
        onOpenAuditor={() => setIsAuditorOpen(true)}
        onOpenAIDesk={() => setIsAIDeskOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onExportCSV={handleExportCSV}
        onOpenWizard={() => setCurrentView('WIZARD')}
        onGoToLanding={() => setCurrentView('LANDING')}
        onSelectPreset={handleSelectPreset}
        onOpenChecklist={() => setCurrentView('CHECKLIST')}
        onOpenProfile={() => setCurrentView('PROFILE')}
      />

      {/* AI Document Readiness & Risk Auditor Modal */}
      <DocumentAuditorModal
        isOpen={isAuditorOpen}
        onClose={() => setIsAuditorOpen(false)}
        profile={profile}
      />

      {/* Executive Regulatory Dossier Printable Modal */}
      <ExecutiveDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        profile={profile}
        items={items}
        matrix={matrix}
      />

      {/* Collapsible Floating AI Assistant Dock */}
      <AuraIntelligenceDesk
        isOpen={isAIDeskOpen}
        onClose={() => setIsAIDeskOpen(false)}
        onOpen={() => setIsAIDeskOpen(true)}
        profile={profile}
        selectedItemForAI={selectedItemForAI}
        onClearSelectedItem={() => setSelectedItemForAI(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ThemeProvider>
  );
}
