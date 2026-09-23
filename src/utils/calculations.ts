import type { CalculatedRow, InvoiceCalculations, LineItem } from "../types/document";

/**
 * Split a numeric amount into Rupees (integer) and Paise (2-digit string).
 * e.g. 4237.29 -> { rs: 4237, p: '29' }
 * e.g. 700.00  -> { rs: 700, p: '00' }
 */
export function splitRsPaise(amount: number): { rs: number; p: string } {
  const rounded = Math.round(amount * 100) / 100;
  const rs = Math.floor(rounded);
  const pNum = Math.round((rounded - rs) * 100);
  const p = pNum.toString().padStart(2, "0");
  return { rs, p };
}

/**
 * Format a number to 2 decimal places string: e.g. 126.00
 */
export function formatCurrency(amount: number): string {
  return (Math.round(amount * 100) / 100).toFixed(2);
}

/**
 * Format currency with Indian Comma separators (e.g. 1,08,560.00)
 */
export function formatIndianNumber(amount: number): string {
  const parts = (Math.round(amount * 100) / 100).toFixed(2).split(".");
  const numStr = parts[0];
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  const formatted =
    otherNumbers !== ""
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;
  return `${formatted}.${parts[1]}`;
}

/**
 * Convert ISO date YYYY-MM-DD to Indian format DD.MM.YYYY
 */
export function formatDateToIndian(dateStr: string): string {
  if (!dateStr) return "";
  if (dateStr.includes(".")) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

/**
 * Convert number into Words (Indian numbering system: Lakh, Crore)
 */
export function numberToWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertSection(n: number): string {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + a[n % 10] : "");
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  }

  const rounded = Math.round(num);
  let crore = Math.floor(rounded / 10000000);
  let remainder = rounded % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder %= 1000;
  let hundred = remainder;

  let result = "";
  if (crore > 0) result += convertSection(crore) + " Crore ";
  if (lakh > 0) result += convertSection(lakh) + " Lakh ";
  if (thousand > 0) result += convertSection(thousand) + " Thousand ";
  if (hundred > 0) result += convertSection(hundred);

  return `Rupees ${result.trim()} Only`;
}

/**
 * Compute invoice row math and grand totals.
 */
export function calculateInvoice(
  items: LineItem[],
  isGstInclusive: boolean,
  gstRate: number = 18,
  isNonGst: boolean = false,
): InvoiceCalculations {
  let totalTaxable = 0;
  let totalGst = 0;

  const rows: CalculatedRow[] = items.map((item, index) => {
    const qty = typeof item.quantity === "number" ? item.quantity : 0;
    const totalPrice = typeof item.totalPrice === "number" ? item.totalPrice : 0;

    let taxableAmount = 0;
    let gstAmount = 0;
    let totalRowAmount = 0;

    if (isNonGst || gstRate === 0) {
      taxableAmount = totalPrice;
      gstAmount = 0;
      totalRowAmount = totalPrice;
    } else if (isGstInclusive) {
      const factor = 1 + gstRate / 100;
      taxableAmount = totalPrice / factor;
      gstAmount = totalPrice - taxableAmount;
      totalRowAmount = totalPrice;
    } else {
      taxableAmount = totalPrice;
      gstAmount = (totalPrice * gstRate) / 100;
      totalRowAmount = taxableAmount + gstAmount;
    }

    totalTaxable += taxableAmount;
    totalGst += gstAmount;

    const { rs: amountRs, p: amountP } = splitRsPaise(taxableAmount);
    const unitRate = qty > 0 ? taxableAmount / qty : 0;

    return {
      sNo: index + 1,
      particulars: item.particulars || "",
      quantity: item.quantity,
      unitRate,
      taxableAmount,
      gstAmount,
      totalRowAmount,
      amountRs,
      amountP,
      gstDisplay: isNonGst ? "0.00" : formatCurrency(gstAmount),
    };
  });

  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const netTotal = totalTaxable + totalGst;
  const grandTotal = Math.round(netTotal);
  const roundOff = grandTotal - netTotal;

  const { rs: taxableRs, p: taxableP } = splitRsPaise(totalTaxable);
  const { rs: grandTotalRs, p: grandTotalP } = splitRsPaise(grandTotal);

  return {
    rows,
    totalTaxable,
    totalGst,
    cgst,
    sgst,
    netTotal,
    roundOff,
    grandTotal,
    taxableRs,
    taxableP,
    grandTotalRs,
    grandTotalP,
    totalGstDisplay: isNonGst ? "0.00" : formatCurrency(totalGst),
    cgstDisplay: isNonGst ? "0.00" : formatCurrency(cgst),
    sgstDisplay: isNonGst ? "0.00" : formatCurrency(sgst),
  };
}
