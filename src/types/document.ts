export type DocumentType = "invoice" | "letter";

export interface LineItem {
  id: string;
  particulars: string;
  quantity: number | "";
  totalPrice: number | ""; // Total price entered by user
}

export interface BankDetails {
  accountName: string;
  accountNo: string;
  ifscCode: string;
  bankName: string;
  branch?: string;
  upiId?: string;
}

export interface InvoiceData {
  documentType: "invoice";
  clientName: string;
  clientAddress: string;
  clientGst: string;
  billNo: string;
  stateCode: string;
  date: string; // "DD.MM.YYYY" or "YYYY-MM-DD"
  isGstInclusive: boolean; // default: true
  gstRate: number; // default: 18
  items: LineItem[];
  bankDetails: BankDetails;
  letterheadOffsetMm: number; // default: 55
  showDigitalHeader: boolean;
}

export interface LetterData {
  documentType: "letter";
  date: string;
  refNo: string;
  recipientName: string;
  recipientOrg: string;
  recipientAddress: string;
  subject: string;
  salutation: string;
  body: string;
  signatoryCompany: string;
  signatoryTitle: string;
  letterheadOffsetMm: number;
  showDigitalHeader: boolean;
}

export interface CalculatedRow {
  sNo: number;
  particulars: string;
  quantity: number | "";
  unitRate: number;
  taxableAmount: number;
  gstAmount: number;
  totalRowAmount: number;
  amountRs: number;
  amountP: string;
  gstDisplay: string;
}

export interface InvoiceCalculations {
  rows: CalculatedRow[];
  totalTaxable: number;
  totalGst: number;
  cgst: number;
  sgst: number;
  netTotal: number;
  roundOff: number;
  grandTotal: number;
  taxableRs: number;
  taxableP: string;
  grandTotalRs: number;
  grandTotalP: string;
  totalGstDisplay: string;
  cgstDisplay: string;
  sgstDisplay: string;
}
