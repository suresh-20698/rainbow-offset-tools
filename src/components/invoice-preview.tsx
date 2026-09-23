import React from "react";

import type { InvoiceData } from "../types/document";
import { calculateInvoice, formatCurrency, formatDateToIndian } from "../utils/calculations";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const isNonGst = !data.clientGst || data.clientGst.trim() === "";
  const calculations = calculateInvoice(data.items, data.isGstInclusive, data.gstRate, isNonGst);

  return (
    <div
      className="a4-page bg-white font-sans shadow-2xl ring-1 ring-slate-200 transition-all"
      style={{
        paddingTop: data.showDigitalHeader ? "14mm" : `${data.letterheadOffsetMm}mm`,
        paddingLeft: "18mm",
        paddingRight: "18mm",
        paddingBottom: "16mm",
      }}
    >
      {/* 1. Optional Digital Header (for digital PDF export / plain paper) */}
      {data.showDigitalHeader && (
        <div className="mb-6 flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="font-sans text-2xl font-black tracking-tight text-slate-950 uppercase">
              Rainbow Offset
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              High-Precision Commercial Offset Printing &amp; Publishing
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Thanjavur, Tamil Nadu • State Code: 33
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="inline-block rounded bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
              GST: 33AADFH1286J1ZG
            </span>
            <div className="text-[11px] text-slate-500">Ph: +91 98424 XXXXX</div>
          </div>
        </div>
      )}

      {/* 2. Main Professional Content Container */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-4">
          {/* Invoice Header Title Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                {isNonGst ? "Invoice" : "Tax Invoice"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">Original for Recipient</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1">
                <span className="text-xs font-medium text-slate-500">Invoice No:</span>
                <span className="text-sm font-bold text-slate-900">
                  {data.billNo ? `#${data.billNo}` : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Client Details & Invoice Meta Grid (Wider Billed To + Compact Overview) */}
          <div className="grid grid-cols-12 items-stretch gap-3.5">
            {/* Billed To Card (Wider: 7 cols / ~60%) */}
            <div className="col-span-7 flex flex-col justify-between space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Billed To (Client Details)
                </span>
                <h3 className="text-sm leading-snug font-bold text-slate-900 uppercase">
                  {data.clientName || "_____________________________________"}
                </h3>
                <p className="text-xs leading-relaxed font-normal whitespace-pre-line text-slate-700">
                  {data.clientAddress || "Client Address Line 1\nCity, State - PIN"}
                </p>
              </div>

              {/* Perfectly Aligned GSTIN Row */}
              <div className="flex items-center justify-between border-t border-slate-200/90 pt-2">
                <span className="text-xs font-medium text-slate-600">GSTIN / Tax ID:</span>
                <span className="rounded border border-slate-200/80 bg-white px-2.5 py-0.5 text-xs font-bold text-slate-900 shadow-2xs">
                  {data.clientGst || (isNonGst ? "NIL / Non-GST" : "—")}
                </span>
              </div>
            </div>

            {/* Invoice Meta Card (Compact: 5 cols / ~40%) */}
            <div className="col-span-5 flex flex-col justify-between space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="space-y-2">
                <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Invoice Overview
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Invoice Date:</span>
                    <span className="font-bold text-slate-900">
                      {formatDateToIndian(data.date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Place of Supply:</span>
                    <span className="font-bold text-slate-900">
                      Tamil Nadu ({data.stateCode || "33"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/90 pt-2 text-xs">
                <span className="text-slate-500">Pricing Mode:</span>
                <span className="text-[11px] font-semibold text-slate-800">
                  {data.isGstInclusive ? "GST Inclusive (18%)" : "GST Exclusive (+18%)"}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/90 text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                  <th className="w-10 px-3 py-2.5 text-center">#</th>
                  <th className="px-3 py-2.5">Particulars / Job Description</th>
                  <th className="w-16 px-3 py-2.5 text-center">Qty</th>
                  <th className="w-24 px-3 py-2.5 text-right">Rate (₹)</th>
                  <th className="w-24 px-3 py-2.5 text-right">
                    {isNonGst ? "GST" : `GST (${data.gstRate}%)`}
                  </th>
                  <th className="w-28 px-3 py-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {calculations.rows.map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 text-center font-medium text-slate-500">
                      {row.sNo}
                    </td>
                    <td className="px-3 py-2.5 text-[12.5px] font-semibold text-slate-900">
                      {row.particulars || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center font-medium">{row.quantity || "—"}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-600">
                      {row.unitRate > 0 ? formatCurrency(row.unitRate) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-600">
                      {row.gstDisplay}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-950">
                      {formatCurrency(row.taxableAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compact Financial Summary Strip (Horizontal full-width layout to save vertical space) */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-2 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                  Taxable Amount
                </span>
                <span className="block text-xs font-bold text-slate-900">
                  ₹{formatCurrency(calculations.totalTaxable)}
                </span>
              </div>

              {!isNonGst && (
                <>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                      CGST ({data.gstRate / 2}%)
                    </span>
                    <span className="block text-xs font-semibold text-slate-700">
                      ₹{formatCurrency(calculations.cgst)}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                      SGST ({data.gstRate / 2}%)
                    </span>
                    <span className="block text-xs font-semibold text-slate-700">
                      ₹{formatCurrency(calculations.sgst)}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                      Total GST
                    </span>
                    <span className="block text-xs font-bold text-slate-900">
                      ₹{formatCurrency(calculations.totalGst)}
                    </span>
                  </div>
                </>
              )}

              {calculations.roundOff !== 0 && (
                <>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                      Round Off
                    </span>
                    <span className="block text-xs font-medium text-slate-600">
                      {calculations.roundOff > 0 ? "+" : ""}
                      {formatCurrency(calculations.roundOff)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Prominent Compact Grand Total */}
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-300/90 bg-white px-3 py-1.5 shadow-2xs">
              <span className="text-[11px] font-black tracking-wider text-slate-700 uppercase">
                Grand Total:
              </span>
              <span className="text-sm font-black text-slate-950">
                ₹{calculations.grandTotal.toLocaleString("en-IN")}.00
              </span>
            </div>
          </div>
        </div>

        {/* 3. Footer: Clear, Readable Bank Details (Left) + Signatory Block (Right) */}
        <div className="mt-auto flex items-end justify-between gap-6 border-t border-slate-200 pt-4 text-xs">
          {/* Left: Compact, High-Legibility Bank & Payment Details Card */}
          <div className="max-w-lg flex-1 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/90 p-3.5">
            <div className="border-b border-slate-200/80 pb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                Bank &amp; Payment Details
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Row 1: Account Name Stacked */}
              <div>
                <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  Account Name
                </span>
                <span className="block text-[12.5px] leading-snug font-bold text-slate-900">
                  {data.bankDetails.accountName}
                </span>
              </div>

              {/* Row 2: A/C No, Bank Name, IFSC Code all in the same line */}
              <div className="grid grid-cols-3 gap-3 border-t border-slate-200/60 pt-1.5">
                <div>
                  <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    A/C No
                  </span>
                  <span className="block text-xs font-bold tracking-wide text-slate-900">
                    {data.bankDetails.accountNo}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    Bank Name
                  </span>
                  <span className="block text-xs font-bold text-slate-900">
                    {data.bankDetails.bankName}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    IFSC Code
                  </span>
                  <span className="block text-xs font-bold tracking-wide text-slate-900">
                    {data.bankDetails.ifscCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Authorised Signatory */}
          <div className="w-56 shrink-0 space-y-10 text-right">
            <div className="text-xs font-bold tracking-wide text-slate-900 uppercase">
              For Rainbow Offset Printer
            </div>
            <div className="border-t border-slate-400 pt-1 text-[11.5px] font-medium text-slate-700">
              Authorised Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
