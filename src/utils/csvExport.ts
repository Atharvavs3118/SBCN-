import { ComplianceItem } from '../types';

/**
 * Escapes a single value for RFC 4180 CSV compliance.
 * Handles strings with quotes, commas, and line breaks.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val);
  // If the string contains double quotes, commas, or line breaks, enclose in quotes and escape internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers a browser download of the compliance roadmap as a CSV file.
 * UTF-8 Byte Order Mark (BOM) is prepended to ensure perfect rendering in Microsoft Excel,
 * Google Sheets, and Apple Numbers without character mangling.
 */
export function exportComplianceRoadmapToCSV(
  items: ComplianceItem[],
  businessName: string = 'Company',
  scopeLabel: string = 'All Applicable'
): void {
  // Only export applicable items
  const applicableItems = items.filter((i) => i.isApplicable);

  if (applicableItems.length === 0) {
    alert('No applicable statutory compliance obligations to export.');
    return;
  }

  // Define headers for the spreadsheet
  const headers = [
    'Item ID',
    'Phase Number',
    'Phase Stage',
    'Obligation Title',
    'Category',
    'Governing Act / Code',
    'Statutory Authority',
    'Obligation Type',
    'Compliance Status',
    'Turnaround Window',
    'Turnaround (Days)',
    'Govt Fee (INR)',
    'Professional Service Fee (INR)',
    'Total Estimated Outlay (INR)',
    'Penalty Severity',
    'Statutory Penalty & Legal Exposure',
    'Official Portal Name',
    'Official Portal URL',
    'Applicability Trigger Rationale',
    'Statutory Summary & Requirements',
    'Prerequisites',
    'Verification Action Checklist',
  ];

  const rows = applicableItems.map((item) => {
    const totalFee = (item.govtFee || 0) + (item.professionalFee || 0);
    const prerequisitesFormatted = item.prerequisites && item.prerequisites.length > 0
      ? item.prerequisites.join('; ')
      : 'None';
    const checklistFormatted = item.checklist && item.checklist.length > 0
      ? item.checklist.map((step, idx) => `[${idx + 1}] ${step}`).join(' | ')
      : 'Standard filing';

    return [
      escapeCsvValue(item.id),
      escapeCsvValue(item.phase),
      escapeCsvValue(item.phaseLabel),
      escapeCsvValue(item.title),
      escapeCsvValue(item.category),
      escapeCsvValue(item.governingAct),
      escapeCsvValue(item.statutoryAuthority),
      escapeCsvValue(item.obligationType),
      escapeCsvValue(item.userStatus),
      escapeCsvValue(item.turnaroundTime),
      escapeCsvValue(item.turnaroundDays),
      escapeCsvValue(item.govtFee),
      escapeCsvValue(item.professionalFee),
      escapeCsvValue(totalFee),
      escapeCsvValue(item.penaltySeverity),
      escapeCsvValue(item.penaltyRisk),
      escapeCsvValue(item.portalName),
      escapeCsvValue(item.portalUrl),
      escapeCsvValue(item.triggersSummary),
      escapeCsvValue(item.summary),
      escapeCsvValue(prerequisitesFormatted),
      escapeCsvValue(checklistFormatted),
    ].join(',');
  });

  // Construct CSV content with UTF-8 BOM
  const csvContent = '\uFEFF' + [headers.map(escapeCsvValue).join(','), ...rows].join('\r\n');

  // Create downloadable blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Sanitize business name for filename
  const cleanName = businessName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Aura_Compliance';
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `${cleanName}_Compliance_Roadmap_${timestamp}.csv`;

  // Trigger download link
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release object URL
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
