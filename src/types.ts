export type EntityStructure =
  | 'Private Limited'
  | 'Limited Liability Partnership (LLP)'
  | 'One Person Company (OPC)'
  | 'Sole Proprietorship'
  | 'Public Limited'
  | 'Partnership Firm';

export type OperationalSector =
  | 'SaaS & Cloud Software'
  | 'F&B / Hospitality'
  | 'Healthcare & Diagnostics'
  | 'Light Manufacturing'
  | 'Retail & E-Commerce'
  | 'Fintech / NBFC'
  | 'Professional Services & Consulting';

export type HeadcountTier = '1–9' | '10–19' | '20–49' | '50+';

export type RevenueThreshold = '<₹20L' | '₹20L–₹40L' | '₹40L–₹1.5Cr' | '₹1.5Cr+';

export type FootprintType =
  | 'Physical Commercial Premise'
  | 'Remote / Virtual Office'
  | 'Industrial / Warehouse'
  | 'Residential / Home Office';

export type CrossBorderMode =
  | 'None (Domestic Only)'
  | 'Export Services (SaaS / Global Tech)'
  | 'Import / Export of Physical Goods'
  | 'Cross-Border D2C / Foreign Remittances';

export type OnlineDeliveryModel =
  | 'None'
  | 'Direct Delivery (Own Fleet / D2C)'
  | 'Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)'
  | 'E-Commerce Marketplace (Amazon / Flipkart / Meesho)'
  | 'Third-Party Courier Logistics (Shiprocket / BlueDart / Delhivery)';

export type ImportExportType =
  | 'None (Domestic Only)'
  | 'Export of Services (SaaS / Tech / Consulting)'
  | 'Import of Goods & Raw Materials'
  | 'Export of Physical Goods'
  | 'Both Import and Export';

export type ComplianceObligationType = 'Mandatory' | 'Conditional' | 'Optional';

export type PenaltySeverity = 'Critical' | 'High' | 'Medium';

export type ComplianceStatus = 'Pending' | 'In Progress' | 'Completed' | 'Waived';

export interface DocumentChecklistItem {
  id: string;
  name: string;
  category: 'Identity Proof' | 'Address Proof' | 'Entity Charter' | 'Financial & Tax' | 'Operational & Technical';
  isMandatory: boolean;
  description: string;
  acceptedFormats: string;
}

export interface RecommendationRationale {
  reason: string;
  triggeredBy: string[];
  statutoryBasis: string;
  nonCompliancePenalty: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  phase: 1 | 2 | 3 | 4;
  phaseLabel: string;
  category: string;
  statutoryAuthority: string;
  governingAct: string;
  obligationType: ComplianceObligationType;
  turnaroundTime: string;
  turnaroundDays: number;
  govtFee: number;
  professionalFee: number;
  penaltyRisk: string;
  penaltySeverity: PenaltySeverity;
  portalUrl: string;
  portalName: string;
  summary: string;
  prerequisites: string[];
  checklist: string[];
  detailedDocuments?: DocumentChecklistItem[];
  whyRecommended?: RecommendationRationale;
  triggersSummary: string;
  isApplicable: boolean;
  userStatus: ComplianceStatus;
  notes?: string;
}

export interface ProfileState {
  businessName: string;
  // 1. Business Type
  entityType: EntityStructure;
  // 2. Location
  state: string;
  city: string;
  footprint: FootprintType;
  // 3. Number of Employees
  exactHeadcount: number;
  headcountTier: HeadcountTier;
  // 4. Business Category
  sector: OperationalSector;
  // 5. Online Delivery Activity
  hasOnlineDelivery: boolean;
  onlineDeliveryModel: OnlineDeliveryModel;
  // 6. Import / Export Activity
  hasImportExport: boolean;
  importExportType: ImportExportType;
  // Financial & Operational Context
  revenueThreshold: RevenueThreshold;
  crossBorder: CrossBorderMode;
  incorporationStatus: 'Pre-Incorporation / Planning' | 'Filing in Progress' | 'Actively Commercial';
  handlingFood: boolean;
  handlingEffluentOrPollution: boolean;
  takesForeignCapital: boolean;
  handlingCustomerPersonalData: boolean;
  // Verification & Checklist Additions
  logoUrl?: string;
  gstNumber?: string;
  gstVerified?: boolean;
  gstVerificationData?: any;
  uploadedCertificateName?: string;
  checklistCompleted?: boolean;
}

export interface MissingInfoAlert {
  id: string;
  field: keyof ProfileState | 'turnoverExact' | 'premiseProof';
  title: string;
  description: string;
  impact: string;
  affectedRequirements: string[];
  severity: 'high' | 'medium' | 'low';
  suggestedAction: string;
  quickActionType: 'toggle' | 'select' | 'input';
}

export interface ReadinessScoreBreakdown {
  overallScore: number; // 0 to 100
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
  pillars: {
    corporateIdentity: number;
    operationalLicenses: number;
    laborSocialSecurity: number;
    taxGovernance: number;
  };
  penaltyExposureEstimate: number; // in INR
  totalRequirements: number;
  completedRequirements: number;
  pendingCriticalRequirements: number;
  readinessStage: 'Formation Planning' | 'Foundation Set' | 'Operationally Ready' | 'Fully Compliant';
  keyVulnerabilities: string[];
  overallGrade?: string;
  riskTier?: 'LOW' | 'MODERATE' | 'HIGH';
  estimatedPenaltyExposureInINR?: number;
  pillarScores?: {
    corporateGovernance: number;
    taxAndGst: number;
    laborAndWorkforce: number;
    industrySpecific: number;
  };
}

export interface ExposureMatrix {
  burdenIndex: number; // 0 to 100
  burdenLevel: 'Low' | 'Moderate' | 'Critical';
  setupDays: number;
  minGovtFee: number;
  minProfessionalFee: number;
  totalBudget: number;
  healthScore: number; // 0 to 100
  totalApplicable: number;
  totalResolved: number;
  criticalPendingCount: number;
  breakdown?: ReadinessScoreBreakdown;
  readinessBreakdown?: ReadinessScoreBreakdown;
  missingInfoAlerts?: MissingInfoAlert[];
}

export interface DocumentAuditDiscrepancy {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  detail: string;
  remedy: string;
}

export interface DocumentAuditResult {
  id: string;
  documentName: string;
  documentType: 'lease_deed' | 'utility_bill' | 'board_resolution' | 'pan_directors' | 'moa_aoa';
  overallStatus: 'READY' | 'ACTION_REQUIRED' | 'REJECTED';
  complianceScore: number;
  discrepanciesFound: DocumentAuditDiscrepancy[];
  statutoryRequirementsMet: string[];
  executiveSummary: string;
  auditedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}
