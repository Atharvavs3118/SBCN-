import {
  ComplianceItem,
  ProfileState,
  ExposureMatrix,
  ComplianceStatus,
  MissingInfoAlert,
  ReadinessScoreBreakdown,
} from '../types';
import { MASTER_STATUTORY_CATALOG, getDocumentChecklistForItem } from './complianceDatabase';

export function evaluateComplianceRoadmap(
  profile: ProfileState,
  savedStatuses: Record<string, ComplianceStatus> = {}
): {
  items: ComplianceItem[];
  matrix: ExposureMatrix;
} {
  const isCorporate =
    profile.entityType === 'Private Limited' ||
    profile.entityType === 'Public Limited' ||
    profile.entityType === 'One Person Company (OPC)';

  const isLLP = profile.entityType === 'Limited Liability Partnership (LLP)';
  const isSoleProp = profile.entityType === 'Sole Proprietorship';

  const headcount = profile.exactHeadcount || 1;
  const isPhysical =
    profile.footprint === 'Physical Commercial Premise' ||
    profile.footprint === 'Industrial / Warehouse';

  // Online delivery evaluation
  const hasDelivery = Boolean(profile.hasOnlineDelivery);
  const deliveryModel = profile.onlineDeliveryModel || 'None';
  const hasInHouseFleet =
    hasDelivery &&
    (deliveryModel === 'Direct Delivery (Own Fleet / D2C)' ||
      deliveryModel === 'Third-Party Courier Logistics (Shiprocket / BlueDart / Delhivery)');

  // Cross border evaluation
  const hasExim =
    Boolean(profile.hasImportExport) ||
    profile.crossBorder !== 'None (Domestic Only)';
  const eximType = profile.importExportType || 'None (Domestic Only)';
  const isPhysicalExim =
    hasExim &&
    (eximType === 'Import of Goods & Raw Materials' ||
      eximType === 'Export of Physical Goods' ||
      eximType === 'Both Import and Export' ||
      profile.crossBorder === 'Import / Export of Physical Goods');
  const isServiceExport =
    hasExim &&
    (eximType === 'Export of Services (SaaS / Tech / Consulting)' ||
      profile.crossBorder === 'Export Services (SaaS / Global Tech)');

  // Sector evaluations
  const isSaaS = profile.sector === 'SaaS & Cloud Software';
  const isFnB = profile.sector === 'F&B / Hospitality';
  const isHealthcare = profile.sector === 'Healthcare & Diagnostics';
  const isManufacturing = profile.sector === 'Light Manufacturing';
  const isRetail = profile.sector === 'Retail & E-Commerce';
  const isFintech = profile.sector === 'Fintech / NBFC';

  const revIsHigh = profile.revenueThreshold === '₹1.5Cr+';
  const revIsAbove20 = profile.revenueThreshold !== '<₹20L';

  const evaluatedItems: ComplianceItem[] = MASTER_STATUTORY_CATALOG.map((catalogItem) => {
    let isApplicable = false;
    let obligationType = catalogItem.obligationType;
    const triggers: string[] = [];
    let reason = '';

    switch (catalogItem.id) {
      // Phase 1: Pre-incorporation
      case 'mca_dsc':
        isApplicable = isCorporate || isLLP;
        if (isApplicable) {
          triggers.push(`Business Type: ${profile.entityType}`);
          reason = `Class 3 DSC is legally mandated for prospective directors/designated partners of ${profile.entityType} entities to digitally authenticate incorporation forms on the MCA V3 portal.`;
        }
        break;

      case 'mca_name_approval':
      case 'mca_incorporation_spice':
        isApplicable = isCorporate || isLLP;
        if (isApplicable) {
          triggers.push(`Business Type: ${profile.entityType}`);
          triggers.push(`Location: ${profile.state}`);
          reason = `Mandatory constitutional filing under Section 7 of the Companies Act / LLP Act to reserve corporate name and obtain the Certificate of Incorporation (CIN).`;
        }
        break;

      case 'it_pan_tan':
        isApplicable = true;
        triggers.push(`Entity Identity: Universal Requirement`);
        reason = `Mandatory permanent statutory identification for direct corporate income tax obligations, banking operations, and TDS withholding registrations.`;
        break;

      case 'mca_commencement_inc20a':
        isApplicable = isCorporate;
        if (isApplicable) {
          triggers.push(`Business Type: ${profile.entityType}`);
          reason = `Statutory declaration required within 180 days of incorporation confirming that subscribers have deposited agreed capital into the company current account.`;
        }
        break;

      case 'mca_first_auditor_adt1':
        isApplicable = isCorporate;
        if (isApplicable) {
          triggers.push(`Business Type: ${profile.entityType}`);
          reason = `Mandatory under Section 139(6) of Companies Act: the Board of Directors must formally appoint the first statutory auditor within 30 days of incorporation.`;
        }
        break;

      // Phase 2: Operational clearances
      case 'state_shop_establishment':
        isApplicable = true;
        obligationType = 'Mandatory';
        triggers.push(`Location: ${profile.state}`);
        triggers.push(`Premise Type: ${profile.footprint}`);
        reason = `State municipal labour law requires every commercial office, warehouse, or virtual establishment in ${profile.state} to hold a valid Shop & Establishment certificate.`;
        break;

      case 'trade_license_municipal':
        isApplicable = isPhysical && (isFnB || isManufacturing || isRetail || isHealthcare);
        obligationType = isFnB || isManufacturing ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Sector: ${profile.sector}`);
          triggers.push(`Operating Footprint: ${profile.footprint}`);
          triggers.push(`Location: ${profile.city || profile.state}`);
          reason = `Local municipal health authority mandates a sanitary trade license to certify commercial operations pose no environmental hazard or public nuisance.`;
        }
        break;

      case 'fssai_license':
        isApplicable = isFnB || profile.handlingFood || (isRetail && profile.handlingFood);
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Sector: ${profile.sector}`);
          if (profile.handlingFood) triggers.push(`Food Handling: Active`);
          reason = `Statutory 14-digit license mandated under Food Safety and Standards Act 2006 for manufacturing, storing, cooking, or distributing edible food items.`;
        }
        break;

      case 'fssai_ecommerce_endorsement':
        isApplicable = (isFnB || profile.handlingFood || isRetail) && hasDelivery;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Sector: ${profile.sector}`);
          triggers.push(`Online Delivery: Active (${deliveryModel})`);
          reason = `Mandatory under FSSAI E-Commerce Regulations 2020: any food business listing on aggregator platforms (Swiggy, Zomato) or operating delivery fulfillment must endorse e-commerce on its FSSAI license.`;
        }
        break;

      case 'consumer_protection_ecommerce':
        isApplicable = hasDelivery || isRetail || (isSaaS && revIsAbove20);
        obligationType = 'Mandatory';
        if (isApplicable) {
          if (hasDelivery) triggers.push(`Online Delivery Activity: Active`);
          if (isRetail) triggers.push(`Sector: Retail & E-Commerce`);
          reason = `Consumer Protection (E-Commerce) Rules 2020 require online sellers and delivery platforms to appoint a resident Grievance Redressal Officer and disclose clear refund/cancellation policies.`;
        }
        break;

      case 'delivery_fleet_motor_guidelines':
        isApplicable = hasInHouseFleet;
        obligationType = 'Conditional';
        if (isApplicable) {
          triggers.push(`Online Delivery Model: ${deliveryModel}`);
          reason = `Motor Vehicle Aggregator Guidelines & commercial transport rules mandate commercial categorization, third-party insurance, and driver safety compliance for dedicated delivery fleets.`;
        }
        break;

      case 'fire_safety_noc':
        isApplicable = isPhysical && (isFnB || isManufacturing || isHealthcare || headcount >= 40);
        obligationType = isFnB || isManufacturing ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Premise: ${profile.footprint}`);
          triggers.push(`Occupancy / Sector: ${profile.sector} with ${headcount} staff`);
          reason = `Required under National Building Code Part 4 for high-occupancy commercial premises, commercial kitchens, or factories to certify emergency evacuation and fire equipment readiness.`;
        }
        break;

      case 'pollution_control_cto':
        isApplicable =
          isManufacturing ||
          profile.handlingEffluentOrPollution ||
          (isFnB && isPhysical) ||
          isHealthcare;
        obligationType = isManufacturing || isHealthcare ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Sector: ${profile.sector}`);
          if (profile.handlingEffluentOrPollution) triggers.push(`Effluent / Emissions: Disclosed`);
          reason = `State Pollution Control Board Consent to Establish (CTE) & Operate (CTO) mandated under Water and Air Pollution Control Acts for commercial emissions, grease traps, or bio-waste.`;
        }
        break;

      case 'legal_metrology_packaging':
        isApplicable = isRetail || isManufacturing || hasDelivery || (isFnB && !isPhysical);
        obligationType = isRetail || isManufacturing ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Sector: ${profile.sector}`);
          if (hasDelivery) triggers.push(`Packaged Delivery Fulfillment: Active`);
          reason = `Rule 27 of Legal Metrology Packaged Commodities Rules mandates packer/importer registration before pre-packaged commodities or branded products are sold or delivered online.`;
        }
        break;

      case 'clinical_est_license':
        isApplicable = isHealthcare;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Sector: Healthcare & Diagnostics`);
          reason = `Mandatory under Clinical Establishments Act 2010 for physical clinics, diagnostics labs, and healthcare practices.`;
        }
        break;

      case 'fintech_rbi_authorization':
        isApplicable = isFintech;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Sector: Fintech / NBFC`);
          reason = `RBI Department of Payment & Settlement Systems requires authorization for digital payment routing, wallet management, or escrow fund handling.`;
        }
        break;

      // Phase 3: Headcount & Social Security
      case 'labour_esic':
        isApplicable = headcount >= 10;
        obligationType = headcount >= 10 ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Headcount: ${headcount} (Threshold: 10+)`);
          reason = `Employees' State Insurance Act mandates compulsory health and medical insurance registration once your team reaches 10 employees for staff earning gross monthly wages up to ₹21,000.`;
        }
        break;

      case 'labour_epfo':
        isApplicable = headcount >= 20;
        obligationType = headcount >= 20 ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Headcount: ${headcount} (Threshold: 20+)`);
          reason = `EPFO Provident Fund registration is legally required under the EPF Act 1952 once the establishment employs 20 or more persons, requiring 12% matching contributions.`;
        }
        break;

      case 'state_ptax':
        isApplicable = true;
        obligationType = 'Mandatory';
        triggers.push(`Location: ${profile.state}`);
        triggers.push(`Headcount: ${headcount} employees`);
        reason = `Mandatory in ${profile.state}: Employer Enrollment (PTEC) for company tax, and Registration (PTRC) to deduct and remit state tax from employee payroll.`;
        break;

      case 'posh_internal_committee':
        isApplicable = headcount >= 10;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Headcount: ${headcount} (Threshold: 10+)`);
          reason = `Section 4 of the POSH Act 2013 mandates an Internal Committee (Presiding Officer woman, 2 employee members, and 1 independent external member) for establishments with 10+ employees.`;
        }
        break;

      case 'gratuity_trust_setup':
        isApplicable = headcount >= 10;
        obligationType = headcount >= 10 ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          triggers.push(`Headcount: ${headcount} (Threshold: 10+)`);
          reason = `Payment of Gratuity Act 1972 mandates provisioning and statutory group gratuity insurance once the enterprise reaches 10 employees.`;
        }
        break;

      case 'creche_facility_mandate':
        isApplicable = headcount >= 50;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Headcount: ${headcount} (Threshold: 50+)`);
          reason = `Section 11A of Maternity Benefit Act mandates a dedicated crèche facility on-premise or within 500 meters for establishments with 50+ staff.`;
        }
        break;

      // Phase 4: Recurring Governance & Filings
      case 'tax_gst_registration':
        isApplicable = revIsAbove20 || hasExim || isRetail || isFintech || isSaaS || hasDelivery;
        obligationType = 'Mandatory';
        if (isApplicable) {
          if (hasDelivery) triggers.push(`Online Delivery (Mandatory under Sec 24(ix) CGST)`);
          if (hasExim) triggers.push(`Cross-Border Trade Activity`);
          if (revIsAbove20) triggers.push(`Turnover: ${profile.revenueThreshold}`);
          reason = hasDelivery
            ? `Section 24(ix) CGST Act mandates compulsory GST registration without any turnover threshold exemption for businesses selling or delivering goods through digital e-commerce channels.`
            : `Mandatory indirect tax registration under Section 22/24 of the CGST Act based on turnover projections, cross-border services, or inter-state supplies.`;
        }
        break;

      case 'ecommerce_gst_tcs':
        isApplicable = hasDelivery || isRetail;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Online Delivery Activity: Active`);
          triggers.push(`Sector: ${profile.sector}`);
          reason = `Section 52 of CGST Act mandates 1% Tax Collected at Source (TCS) deduction on net taxable supplies facilitated by e-commerce operators, requiring monthly GSTR-8 credit matching.`;
        }
        break;

      case 'tax_gst_returns':
        isApplicable = revIsAbove20 || hasExim || isRetail || isFintech || isSaaS || hasDelivery;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Active Indirect Tax Regimen`);
          reason = `Recurring statutory filing: GSTR-1 (outward supplies by the 11th) and GSTR-3B (tax settlement by the 20th) of each succeeding month.`;
        }
        break;

      case 'tax_gst_lut_export':
        isApplicable = hasExim && (isServiceExport || isSaaS);
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Export Mode: ${profile.importExportType}`);
          triggers.push(`Sector: ${profile.sector}`);
          reason = `Form GST RFD-11 Letter of Undertaking allows zero-rated export of software/services without payment of 18% integrated GST upfront, preserving working capital.`;
        }
        break;

      case 'trade_iec_dgft':
        isApplicable = hasExim;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Cross-Border Trade: ${profile.importExportType}`);
          reason = `10-digit Import Export Code (IEC) from DGFT is legally mandatory for commercial foreign exchange receipts, software export reporting, or physical shipment clearance.`;
        }
        break;

      case 'customs_ad_code_icegate':
        isApplicable = isPhysicalExim;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Physical Cross-Border Trade: ${profile.importExportType}`);
          reason = `Mandatory customs gateway registration linking your bank's 14-digit Authorized Dealer (AD) code to specific sea/air ports on ICEGATE for export-import cargo dispatch.`;
        }
        break;

      case 'fema_softex_reporting':
        isApplicable = isServiceExport || (hasExim && isSaaS);
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Cross-Border Services: ${profile.importExportType}`);
          triggers.push(`Sector: ${profile.sector}`);
          reason = `RBI and STPI regulations require submitting statutory SOFTEX declarations within 30 days of invoice generation to certify foreign currency software/services exports against inward remittances (EDPMS).`;
        }
        break;

      case 'privacy_dpdp_gdpr':
        isApplicable = profile.handlingCustomerPersonalData || isSaaS || isFintech || hasDelivery || isRetail;
        obligationType = isSaaS || isFintech || hasDelivery ? 'Mandatory' : 'Conditional';
        if (isApplicable) {
          if (hasDelivery) triggers.push(`Online Customer Delivery Data: Processed`);
          if (isSaaS) triggers.push(`Cloud SaaS Platform Architecture`);
          if (profile.handlingCustomerPersonalData) triggers.push(`Customer Personal Data: Processed`);
          reason = `Digital Personal Data Protection Act 2023 mandates clear consent notices, customer data protection, and grievance redressal for entities processing user contact, location, and payment data.`;
        }
        break;

      case 'tax_advance_tax':
        isApplicable = true;
        obligationType = 'Mandatory';
        triggers.push(`Corporate Tax Regime`);
        reason = `Mandatory quarterly staged corporate income tax installments (15%, 45%, 75%, 100%) under Sections 208–211 of Income Tax Act if annual tax liability exceeds ₹10,000.`;
        break;

      case 'tax_section_44ab_audit':
        isApplicable = revIsHigh;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Revenue Threshold: ${profile.revenueThreshold} (> ₹1.5 Cr)`);
          reason = `Section 44AB requires comprehensive tax audit by a practicing Chartered Accountant in Form 3CA/3CD when business turnover exceeds statutory threshold.`;
        }
        break;

      case 'mca_annual_filings':
        isApplicable = isCorporate || isLLP;
        obligationType = 'Mandatory';
        if (isApplicable) {
          triggers.push(`Business Type: ${profile.entityType}`);
          reason = `Mandatory annual ROC governance filings: Form AOC-4 (Financial Statements), Form MGT-7 (Annual Return), and annual DIR-3 KYC for each director.`;
        }
        break;

      default:
        isApplicable = true;
        triggers.push(`Standard Compliance Baseline`);
        reason = `Statutory operational baseline requirement for registered commercial enterprises in India.`;
    }

    const userStatus = savedStatuses[catalogItem.id] || 'Pending';
    const detailedDocuments = getDocumentChecklistForItem(catalogItem.id);

    return {
      ...catalogItem,
      obligationType,
      isApplicable,
      userStatus,
      detailedDocuments,
      whyRecommended: isApplicable
        ? {
            reason:
              reason ||
              `Recommended for your ${profile.entityType} business operating in ${profile.sector}.`,
            triggeredBy: triggers.length > 0 ? triggers : [`Entity: ${profile.entityType}`],
            statutoryBasis: catalogItem.governingAct,
            nonCompliancePenalty: catalogItem.penaltyRisk,
          }
        : undefined,
    };
  });

  const matrix = calculateExposureMatrix(profile, evaluatedItems);

  return {
    items: evaluatedItems,
    matrix,
  };
}

function calculateExposureMatrix(profile: ProfileState, items: ComplianceItem[]): ExposureMatrix {
  const applicableItems = items.filter((i) => i.isApplicable);

  // 1. Calculate Minimum Statutory Budget
  let minGovtFee = 0;
  let minProfessionalFee = 0;

  applicableItems.forEach((item) => {
    if (item.obligationType === 'Mandatory') {
      minGovtFee += item.govtFee;
      minProfessionalFee += item.professionalFee;
    } else {
      minGovtFee += item.govtFee * 0.5;
      minProfessionalFee += item.professionalFee * 0.5;
    }
  });

  const totalBudget = Math.round(minGovtFee + minProfessionalFee);

  // 2. Timeline
  const phase1Items = applicableItems.filter((i) => i.phase === 1);
  const phase2Items = applicableItems.filter((i) => i.phase === 2);

  const phase1Days = phase1Items.reduce(
    (acc, curr) => acc + (curr.turnaroundDays > 3 ? curr.turnaroundDays : 1),
    0
  );
  const maxPhase2Days =
    phase2Items.length > 0 ? Math.max(...phase2Items.map((i) => i.turnaroundDays)) : 0;

  const estimatedDays = Math.max(12, Math.min(75, phase1Days + Math.round(maxPhase2Days * 0.8)));

  // 3. Burden Index
  let burdenScore = 20;
  if (profile.entityType === 'Public Limited') burdenScore += 30;
  else if (profile.entityType === 'Private Limited') burdenScore += 18;
  else if (profile.entityType === 'Limited Liability Partnership (LLP)') burdenScore += 12;
  else if (profile.entityType === 'Sole Proprietorship') burdenScore += 4;

  if (profile.sector === 'Fintech / NBFC') burdenScore += 26;
  else if (profile.sector === 'Healthcare & Diagnostics') burdenScore += 22;
  else if (profile.sector === 'F&B / Hospitality') burdenScore += 18;
  else if (profile.sector === 'Light Manufacturing') burdenScore += 20;
  else if (profile.sector === 'SaaS & Cloud Software') burdenScore += 12;
  else if (profile.sector === 'Retail & E-Commerce') burdenScore += 14;

  if (profile.exactHeadcount >= 50) burdenScore += 18;
  else if (profile.exactHeadcount >= 20) burdenScore += 12;
  else if (profile.exactHeadcount >= 10) burdenScore += 7;

  if (profile.hasOnlineDelivery) burdenScore += 10;
  if (profile.hasImportExport || profile.crossBorder !== 'None (Domestic Only)') burdenScore += 12;

  const burdenIndex = Math.min(100, Math.max(15, Math.round(burdenScore)));
  let burdenLevel: 'Low' | 'Moderate' | 'Critical' = 'Moderate';
  if (burdenIndex <= 38) burdenLevel = 'Low';
  else if (burdenIndex >= 70) burdenLevel = 'Critical';

  // 4. Health Score & Pillars
  const totalApplicable = applicableItems.length;
  let resolvedWeightedScore = 0;
  let totalWeightedScore = 0;
  let criticalPendingCount = 0;
  let estimatedPenaltySum = 0;
  const keyVulnerabilities: string[] = [];

  // Pillar scores
  const pillarStats: Record<number, { totalWeight: number; resolvedWeight: number }> = {
    1: { totalWeight: 0, resolvedWeight: 0 },
    2: { totalWeight: 0, resolvedWeight: 0 },
    3: { totalWeight: 0, resolvedWeight: 0 },
    4: { totalWeight: 0, resolvedWeight: 0 },
  };

  applicableItems.forEach((item) => {
    const weight =
      item.penaltySeverity === 'Critical' ? 3 : item.penaltySeverity === 'High' ? 2 : 1;
    totalWeightedScore += weight;

    if (!pillarStats[item.phase]) {
      pillarStats[item.phase] = { totalWeight: 0, resolvedWeight: 0 };
    }
    pillarStats[item.phase].totalWeight += weight;

    if (item.userStatus === 'Completed' || item.userStatus === 'Waived') {
      resolvedWeightedScore += weight;
      pillarStats[item.phase].resolvedWeight += weight;
    } else if (item.userStatus === 'In Progress') {
      resolvedWeightedScore += weight * 0.5;
      pillarStats[item.phase].resolvedWeight += weight * 0.5;
    } else {
      // Pending
      if (item.penaltySeverity === 'Critical') {
        criticalPendingCount++;
        estimatedPenaltySum += 50000;
        keyVulnerabilities.push(`${item.title}: High statutory non-compliance exposure`);
      } else if (item.penaltySeverity === 'High') {
        estimatedPenaltySum += 20000;
      } else {
        estimatedPenaltySum += 5000;
      }
    }
  });

  const healthScore =
    totalWeightedScore > 0
      ? Math.round((resolvedWeightedScore / totalWeightedScore) * 100)
      : 100;
  const totalResolved = applicableItems.filter(
    (i) => i.userStatus === 'Completed' || i.userStatus === 'Waived'
  ).length;

  const computePillarScore = (phase: number) => {
    const p = pillarStats[phase];
    if (!p || p.totalWeight === 0) return 100;
    return Math.round((p.resolvedWeight / p.totalWeight) * 100);
  };

  let riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' = 'Low Risk';
  if (healthScore < 40 || criticalPendingCount >= 3) riskLevel = 'Critical Risk';
  else if (healthScore < 65 || criticalPendingCount >= 1) riskLevel = 'High Risk';
  else if (healthScore < 85) riskLevel = 'Moderate Risk';

  let readinessStage: 'Formation Planning' | 'Foundation Set' | 'Operationally Ready' | 'Fully Compliant' =
    'Formation Planning';
  if (healthScore >= 95) readinessStage = 'Fully Compliant';
  else if (healthScore >= 70) readinessStage = 'Operationally Ready';
  else if (healthScore >= 40) readinessStage = 'Foundation Set';

  const breakdown: ReadinessScoreBreakdown = {
    overallScore: healthScore,
    riskLevel,
    pillars: {
      corporateIdentity: computePillarScore(1),
      operationalLicenses: computePillarScore(2),
      laborSocialSecurity: computePillarScore(3),
      taxGovernance: computePillarScore(4),
    },
    penaltyExposureEstimate: estimatedPenaltySum,
    totalRequirements: totalApplicable,
    completedRequirements: totalResolved,
    pendingCriticalRequirements: criticalPendingCount,
    readinessStage,
    keyVulnerabilities: keyVulnerabilities.slice(0, 4),
    overallGrade: healthScore >= 90 ? 'A+' : healthScore >= 75 ? 'A' : healthScore >= 60 ? 'B' : 'C',
    riskTier: riskLevel === 'Low Risk' ? 'LOW' : riskLevel === 'Moderate Risk' ? 'MODERATE' : 'HIGH',
    estimatedPenaltyExposureInINR: estimatedPenaltySum,
    pillarScores: {
      corporateGovernance: computePillarScore(1),
      taxAndGst: computePillarScore(4),
      laborAndWorkforce: computePillarScore(3),
      industrySpecific: computePillarScore(2),
    },
  };

  // 5. Intelligent Missing Information Detection
  const missingInfoAlerts: MissingInfoAlert[] = [];

  // Check 1: Missing or generic city
  if (!profile.city || profile.city.trim() === '' || profile.city.toLowerCase() === 'not specified') {
    missingInfoAlerts.push({
      id: 'missing_city',
      field: 'city',
      title: 'Municipal Jurisdiction Unconfirmed',
      description: 'Specific city / municipality is not set for the registered office.',
      impact: 'Affects exact municipal Health Trade License fees and Fire NOC jurisdiction.',
      affectedRequirements: ['trade_license_municipal', 'fire_safety_noc', 'state_shop_establishment'],
      severity: 'medium',
      suggestedAction: 'Specify your municipal city (e.g. Mumbai, Bengaluru, Gurugram).',
      quickActionType: 'input',
    });
  }

  // Check 2: Online Delivery model ambiguity
  if (profile.hasOnlineDelivery && (!profile.onlineDeliveryModel || profile.onlineDeliveryModel === 'None')) {
    missingInfoAlerts.push({
      id: 'missing_delivery_model',
      field: 'onlineDeliveryModel',
      title: 'Online Delivery Model Not Specified',
      description: 'Online delivery is active, but the fulfillment mechanism is unconfirmed.',
      impact: 'Determines whether FSSAI Aggregator Endorsement or Own Fleet Motor Norms apply.',
      affectedRequirements: ['fssai_ecommerce_endorsement', 'delivery_fleet_motor_guidelines', 'ecommerce_gst_tcs'],
      severity: 'high',
      suggestedAction: 'Select Aggregator vs In-House Fleet vs E-Commerce Marketplace.',
      quickActionType: 'select',
    });
  }

  // Check 3: Near Headcount Statutory Threshold (e.g., 8-9 or 18-19)
  if (profile.exactHeadcount >= 8 && profile.exactHeadcount <= 9) {
    missingInfoAlerts.push({
      id: 'headcount_threshold_10',
      field: 'exactHeadcount',
      title: 'Approaching 10-Employee Statutory Threshold',
      description: `Current headcount is ${profile.exactHeadcount}. At 10 employees, ESIC, POSH Committee, and Gratuity Trust become legally mandatory.`,
      impact: 'Immediate compliance trigger upon hiring 1-2 additional personnel.',
      affectedRequirements: ['labour_esic', 'posh_internal_committee', 'gratuity_trust_setup'],
      severity: 'medium',
      suggestedAction: 'Confirm upcoming hiring trajectory to prepare ESIC payroll deductions in advance.',
      quickActionType: 'input',
    });
  } else if (profile.exactHeadcount >= 18 && profile.exactHeadcount <= 19) {
    missingInfoAlerts.push({
      id: 'headcount_threshold_20',
      field: 'exactHeadcount',
      title: 'Approaching 20-Employee EPFO Threshold',
      description: `Current headcount is ${profile.exactHeadcount}. At 20 employees, EPFO Universal Provident Fund registration is strictly mandatory.`,
      impact: 'Immediate 12% matching contribution obligation under EPF Act 1952.',
      affectedRequirements: ['labour_epfo'],
      severity: 'high',
      suggestedAction: 'Prepare EPFO employer code and UAN enrolment framework.',
      quickActionType: 'input',
    });
  }

  // Check 4: Cross border ambiguity
  if (profile.hasImportExport && (!profile.importExportType || profile.importExportType === 'None (Domestic Only)')) {
    missingInfoAlerts.push({
      id: 'missing_exim_type',
      field: 'importExportType',
      title: 'Nature of Cross-Border Trade Unclarified',
      description: 'Cross-border trade indicated, but distinction between Service Export and Physical Cargo is unset.',
      impact: 'Customs ICEGATE and AD Code are needed for physical goods, while GST LUT and SOFTEX are needed for services.',
      affectedRequirements: ['trade_iec_dgft', 'tax_gst_lut_export', 'customs_ad_code_icegate', 'fema_softex_reporting'],
      severity: 'high',
      suggestedAction: 'Specify whether you export digital services (SaaS) or import/export physical cargo.',
      quickActionType: 'select',
    });
  }

  return {
    burdenIndex,
    burdenLevel,
    setupDays: estimatedDays,
    minGovtFee: Math.round(minGovtFee),
    minProfessionalFee: Math.round(minProfessionalFee),
    totalBudget,
    healthScore,
    totalApplicable,
    totalResolved,
    criticalPendingCount,
    breakdown,
    readinessBreakdown: breakdown,
    missingInfoAlerts,
  };
}

export const PRESET_COMPANY_PROFILES: Record<string, Partial<ProfileState>> = {
  'early_saas': {
    businessName: 'Apex Cloud Solutions',
    entityType: 'Private Limited',
    sector: 'SaaS & Cloud Software',
    state: 'Karnataka (Bengaluru)',
    city: 'Bengaluru',
    footprint: 'Remote / Virtual Office',
    exactHeadcount: 14,
    headcountTier: '10–19',
    hasOnlineDelivery: false,
    onlineDeliveryModel: 'None',
    hasImportExport: true,
    importExportType: 'Export of Services (SaaS / Tech / Consulting)',
    crossBorder: 'Export Services (SaaS / Global Tech)',
    revenueThreshold: '₹40L–₹1.5Cr',
    incorporationStatus: 'Actively Commercial',
    handlingFood: false,
    handlingEffluentOrPollution: false,
    takesForeignCapital: true,
    handlingCustomerPersonalData: true,
  },
  'cloud_kitchen': {
    businessName: 'Aura Artisan Kitchens & QSR',
    entityType: 'Private Limited',
    sector: 'F&B / Hospitality',
    state: 'Maharashtra (Mumbai/Pune)',
    city: 'Mumbai',
    footprint: 'Physical Commercial Premise',
    exactHeadcount: 26,
    headcountTier: '20–49',
    hasOnlineDelivery: true,
    onlineDeliveryModel: 'Food/Grocery Aggregator (Swiggy / Zomato / Blinkit)',
    hasImportExport: false,
    importExportType: 'None (Domestic Only)',
    crossBorder: 'None (Domestic Only)',
    revenueThreshold: '₹40L–₹1.5Cr',
    incorporationStatus: 'Filing in Progress',
    handlingFood: true,
    handlingEffluentOrPollution: true,
    takesForeignCapital: false,
    handlingCustomerPersonalData: false,
  },
  'd2c_ecommerce': {
    businessName: 'Zenith Lifestyle Direct',
    entityType: 'Private Limited',
    sector: 'Retail & E-Commerce',
    state: 'Delhi-NCR',
    city: 'Gurugram',
    footprint: 'Industrial / Warehouse',
    exactHeadcount: 18,
    headcountTier: '10–19',
    hasOnlineDelivery: true,
    onlineDeliveryModel: 'E-Commerce Marketplace (Amazon / Flipkart / Meesho)',
    hasImportExport: true,
    importExportType: 'Import of Goods & Raw Materials',
    crossBorder: 'Import / Export of Physical Goods',
    revenueThreshold: '₹40L–₹1.5Cr',
    incorporationStatus: 'Actively Commercial',
    handlingFood: false,
    handlingEffluentOrPollution: false,
    takesForeignCapital: false,
    handlingCustomerPersonalData: true,
  },
  'light_manufacturing': {
    businessName: 'Apex Precision Instruments',
    entityType: 'Private Limited',
    sector: 'Light Manufacturing',
    state: 'Gujarat (Ahmedabad/GIFT City)',
    city: 'Ahmedabad',
    footprint: 'Industrial / Warehouse',
    exactHeadcount: 68,
    headcountTier: '50+',
    hasOnlineDelivery: false,
    onlineDeliveryModel: 'None',
    hasImportExport: true,
    importExportType: 'Both Import and Export',
    crossBorder: 'Import / Export of Physical Goods',
    revenueThreshold: '₹1.5Cr+',
    incorporationStatus: 'Actively Commercial',
    handlingFood: false,
    handlingEffluentOrPollution: true,
    takesForeignCapital: false,
    handlingCustomerPersonalData: false,
  },
  'health_clinic': {
    businessName: 'Apex Diagnostic & Wellness Clinics',
    entityType: 'Limited Liability Partnership (LLP)',
    sector: 'Healthcare & Diagnostics',
    state: 'Telangana (Hyderabad)',
    city: 'Hyderabad',
    footprint: 'Physical Commercial Premise',
    exactHeadcount: 22,
    headcountTier: '20–49',
    hasOnlineDelivery: true,
    onlineDeliveryModel: 'Direct Delivery (Own Fleet / D2C)',
    hasImportExport: false,
    importExportType: 'None (Domestic Only)',
    crossBorder: 'None (Domestic Only)',
    revenueThreshold: '₹40L–₹1.5Cr',
    incorporationStatus: 'Actively Commercial',
    handlingFood: false,
    handlingEffluentOrPollution: true,
    takesForeignCapital: false,
    handlingCustomerPersonalData: true,
  },
};
