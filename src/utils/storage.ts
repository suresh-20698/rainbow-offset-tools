import type { BankDetails, InvoiceData, LetterData } from "../types/document";

export const DEFAULT_BANK_DETAILS: BankDetails = {
  accountName: "RAINBOW OFFSET PRINTING PUBLISHING AND TRADING",
  accountNo: "6912675908",
  ifscCode: "IDIB000N133",
  bankName: "Indian Bank",
};

export const DEFAULT_INVOICE: InvoiceData = {
  documentType: "invoice",
  clientName: "HOTEL GNANAM",
  clientAddress: "84/14-A, ANNA SALAI KEELAVASAL,\nTHANJAVUR, Tamil Nadu, 613001",
  clientGst: "33AADFH1286J1ZG",
  billNo: "16",
  stateCode: "33",
  date: new Date().toISOString().split("T")[0],
  isGstInclusive: false,
  gstRate: 18,
  letterheadOffsetMm: 55,
  showDigitalHeader: false,
  bankDetails: DEFAULT_BANK_DETAILS,
  items: [
    { id: "1", particulars: "MD MEMO A6", quantity: 10, totalPrice: 700 },
    { id: "2", particulars: "Letter pad sheet", quantity: 1000, totalPrice: 2000 },
    { id: "3", particulars: "Tariff", quantity: 500, totalPrice: 1000 },
    { id: "4", particulars: "Visiting card", quantity: 1000, totalPrice: 2000 },
    { id: "5", particulars: "Room Entry Form 1 + 2", quantity: 10, totalPrice: 2000 },
    { id: "6", particulars: "Room Booking Form", quantity: 10, totalPrice: 1000 },
    { id: "7", particulars: "Buffet Menu card", quantity: 100, totalPrice: 500 },
  ],
};

export const DEFAULT_LETTER: LetterData = {
  documentType: "letter",
  date: new Date().toISOString().split("T")[0],
  refNo: "RO/2026-27/L-101",
  recipientName: "The General Manager",
  recipientOrg: "Hotel Gnanam",
  recipientAddress: "84/14-A, Anna Salai Keelavasal,\nThanjavur, Tamil Nadu - 613001",
  subject: "Quotation and Confirmation for Offset Printing Stationery",
  salutation: "Dear Sir / Madam,",
  body: `We thank you very much for your valued order and continued patronage with Rainbow Offset Printers.

This letter serves to confirm that your printing order for the current financial year has been scheduled for production. All stationery, including Memo pads, Letterhead sheets, Visiting cards, and Tariff folders, will be executed on premium quality imported boards and papers using high-precision offset technology.

Please feel free to reach out to us for any adjustments or additional requirements. We assure you of our prompt service and highest quality at all times.`,
  signatoryCompany: "For Rainbow Offset Printer",
  signatoryTitle: "Authorised Signature",
  letterheadOffsetMm: 55,
  showDigitalHeader: false,
};

const INVOICE_STORAGE_KEY = "rainbow_offset_invoice_data_v1";
const LETTER_STORAGE_KEY = "rainbow_offset_letter_data_v1";

export function loadInvoiceFromStorage(): InvoiceData {
  try {
    const data = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Failed to load invoice from localStorage:", err);
  }
  return DEFAULT_INVOICE;
}

export function saveInvoiceToStorage(data: InvoiceData): void {
  try {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to save invoice to localStorage:", err);
  }
}

export function loadLetterFromStorage(): LetterData {
  try {
    const data = localStorage.getItem(LETTER_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Failed to load letter from localStorage:", err);
  }
  return DEFAULT_LETTER;
}

export function saveLetterToStorage(data: LetterData): void {
  try {
    localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to save letter to localStorage:", err);
  }
}

/**
 * Generates standardized filename in format: Billcode_clientname_date
 */
export function getDocumentFilename(data: InvoiceData | LetterData): string {
  const sanitize = (str: string) =>
    str
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, "_");

  if (data.documentType === "invoice") {
    const inv = data as InvoiceData;
    const billCode = sanitize(inv.billNo) || "Invoice";
    const clientName = sanitize(inv.clientName) || "Client";
    const date = sanitize(inv.date) || new Date().toISOString().split("T")[0];
    return `${billCode}_${clientName}_${date}`;
  } else {
    const letData = data as LetterData;
    const refCode = sanitize(letData.refNo) || "Letter";
    const recipient = sanitize(letData.recipientOrg || letData.recipientName) || "Recipient";
    const date = sanitize(letData.date) || new Date().toISOString().split("T")[0];
    return `${refCode}_${recipient}_${date}`;
  }
}

/**
 * Trigger download of current document as a .json file
 */
export function exportToJsonFile(data: InvoiceData | LetterData): void {
  const filename = `${getDocumentFilename(data)}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read and parse a uploaded JSON file
 */
export function importFromJsonFile(
  file: File,
  onSuccess: (data: InvoiceData | LetterData) => void,
  onError: (errMessage: string) => void,
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      if (parsed.documentType === "invoice" || parsed.documentType === "letter") {
        onSuccess(parsed);
      } else {
        onError("Invalid file format. Must be an Invoice or Letter document.");
      }
    } catch {
      onError("Failed to parse JSON file.");
    }
  };
  reader.onerror = () => onError("Error reading file.");
  reader.readAsText(file);
}
