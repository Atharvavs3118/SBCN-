export interface SampleDocumentItem {
  id: string;
  name: string;
  type: 'lease_deed' | 'utility_bill' | 'board_resolution' | 'pan_directors' | 'moa_aoa';
  typeName: string;
  fileSize: string;
  previewText: string;
  defaultStatus: 'READY' | 'ACTION_REQUIRED' | 'REJECTED';
  defaultScore: number;
}

export const PRELOADED_SAMPLE_DOCS: SampleDocumentItem[] = [
  {
    id: 'doc_utility_bill',
    name: 'Tata_Power_Commercial_Bill_Q3.pdf',
    type: 'utility_bill',
    typeName: 'Commercial Utility Meter Bill',
    fileSize: '412 KB',
    previewText: `CONSUMER ID: 90281923488
SERVICE ADDRESS: Unit 402, B-Wing, Express Trade Towers, Bandra Kurla Complex, Mumbai 400051
TARIFF CATEGORY: Commercial LT-II (Commercial Establishment)
BILL DATE: 14-Aug-2025 (Payment Due: 28-Aug-2025)
STATUS: Paid in full via NEFT on 22-Aug-2025 (UTR: N283912093)`,
    defaultStatus: 'ACTION_REQUIRED',
    defaultScore: 72,
  },
  {
    id: 'doc_lease_deed',
    name: 'Registered_Commercial_Lease_Deed_BKC.pdf',
    type: 'lease_deed',
    typeName: 'Registered Commercial Lease Agreement',
    fileSize: '2.8 MB',
    previewText: `THIS INDENTURE OF LEASE entered into on this 1st day of July 2025 between K Raheja Realty Corp (Lessor) and Vanguard AI Technologies Pvt Ltd (Lessee).
PREMISES: Office Suite 402, 4th Floor, Tower B, Express Trade Towers, BKC, Bandra East, Mumbai 400051.
STAMP DUTY: e-Challan GRAS No. MH0028919283 paid ₹48,500 under Article 36A of Maharashtra Stamp Act.
LANDLORD NOC: Clause 14 grants explicit, unconditional consent to Lessee to register registered office and obtain GST, FSSAI, Shop & Establishment, and EPFO establishments without separate objection.`,
    defaultStatus: 'READY',
    defaultScore: 94,
  },
  {
    id: 'doc_board_resolution',
    name: 'Certified_Board_Resolution_Bank_Opening.pdf',
    type: 'board_resolution',
    typeName: 'Board Resolution for Banking & SPICe+',
    fileSize: '680 KB',
    previewText: `EXTRACT OF THE MINUTES OF THE MEETING OF BOARD OF DIRECTORS HELD ON 10TH JULY 2025
RESOLVED THAT: The Company do open a Multi-Currency Current Account with HDFC Bank Ltd, Fort Branch.
FURTHER RESOLVED THAT: Mr. Neil Roy (DIN: 09281923) and Ms. Ananya Mehta (DIN: 09849201) be and are hereby severally authorized to operate the said account up to ₹15,00,000, and jointly above ₹15,00,000.
CERTIFIED TRUE COPY signed by Managing Director with corporate seal.`,
    defaultStatus: 'READY',
    defaultScore: 89,
  },
];
