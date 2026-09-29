import React from "react";

import type { InvoiceData } from "../types/document";
import { calculateInvoice, formatCurrency, formatDateToIndian } from "../utils/calculations";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const isNonGst = data.enableGst === false;
  const calculations = calculateInvoice(data.items, data.isGstInclusive, data.gstRate, isNonGst);

  return (
    <div
      className="a4-page bg-white font-sans shadow-2xl ring-1 ring-slate-200 transition-all"
      style={{
        paddingTop: data.showDigitalHeader ? "14mm" : `${data.letterheadOffsetMm}mm`,
        paddingLeft: "18mm",
        paddingRight: "18mm",
        paddingBottom: "24mm",
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
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex min-h-0 flex-1 flex-col space-y-3">
          {/* Invoice Header Title Bar */}
          <div className="shrink-0 border-b border-slate-200 pt-6 pb-1">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
              {isNonGst ? "Invoice" : "Tax Invoice"}
            </h2>
          </div>

          {/* Client Details & Invoice Overview */}
          <div className="flex shrink-0 items-start justify-between gap-8 text-xs">
            {/* Billed To (Client Details) */}
            <div className="flex-1 space-y-1">
              <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Billed To
              </span>
              <h3 className="text-sm leading-snug font-bold text-slate-900 uppercase">
                {data.clientName || "_____________________________________"}
              </h3>
              <p className="text-xs leading-relaxed font-bold whitespace-pre-line text-slate-900">
                {data.clientAddress || "Client Address Line 1\nCity, State - PIN"}
              </p>
              {!isNonGst && (
                <div className="pt-0.5 text-xs">
                  <span className="font-semibold text-slate-600">GSTIN </span>
                  {data.clientGst?.trim() ? (
                    <span className="font-bold text-slate-900">{data.clientGst.trim()}</span>
                  ) : (
                    <span className="font-medium text-slate-400">N/A</span>
                  )}
                </div>
              )}
            </div>

            {/* Invoice Meta */}
            <div className="w-56 shrink-0 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Invoice No</span>
                {data.billNo?.trim() ? (
                  <span className="font-bold text-slate-900">#{data.billNo.trim()}</span>
                ) : (
                  <span className="font-medium text-slate-400">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Invoice Date</span>
                {data.date?.trim() ? (
                  <span className="font-bold text-slate-900">{formatDateToIndian(data.date)}</span>
                ) : (
                  <span className="font-medium text-slate-400">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Place of Supply</span>
                <span className="font-bold text-slate-900">
                  Tamil Nadu ({data.stateCode || "33"})
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Pricing Mode</span>
                <span className="font-semibold text-slate-800">
                  {isNonGst
                    ? "Non-GST"
                    : data.isGstInclusive
                      ? "GST Inclusive (18%)"
                      : "GST Exclusive (+18%)"}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200">
            <table className="h-full w-full border-collapse text-left">
              <thead>
                <tr className="divide-x divide-slate-200 border-b border-slate-200 bg-slate-100/90 text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                  <th className="w-8 px-2 py-2.5 text-center">#</th>
                  <th className="px-3 py-2.5">Particulars / Job Description</th>
                  <th className="w-12 px-2 py-2.5 text-center whitespace-nowrap">Qty</th>
                  <th className="w-20 px-2 py-2.5 text-right whitespace-nowrap">Rate (₹)</th>
                  <th className="w-[86px] px-2 py-2.5 text-right whitespace-nowrap">
                    {isNonGst ? "GST" : `GST (${data.gstRate}%)`}
                  </th>
                  <th className="w-24 px-2.5 py-2.5 text-right whitespace-nowrap">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="h-full text-xs text-slate-800">
                {calculations.rows.map((row) => (
                  <tr key={row.sNo} className="divide-x divide-slate-200 hover:bg-slate-50/50">
                    <td className="px-2 py-2.5 text-center font-medium text-slate-500">
                      {row.sNo}
                    </td>
                    <td className="px-3 py-2.5 text-[12.5px] font-semibold text-slate-900">
                      {row.particulars || ""}
                    </td>
                    <td className="px-2 py-2.5 text-center font-medium whitespace-nowrap">
                      {row.isFlatCharge ? "" : row.quantity || ""}
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium whitespace-nowrap text-slate-600">
                      {!row.isFlatCharge && row.unitRate > 0 ? formatCurrency(row.unitRate) : ""}
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium whitespace-nowrap text-slate-600">
                      {row.isFlatCharge ? "" : row.gstDisplay}
                    </td>
                    <td className="px-2.5 py-2.5 text-right font-bold whitespace-nowrap text-slate-950">
                      {row.taxableAmount > 0 ? formatCurrency(row.taxableAmount) : ""}
                    </td>
                  </tr>
                ))}
                {/* Auto-filled empty space row to extend table columns to the bottom */}
                <tr className="h-full divide-x divide-slate-200">
                  <td className="px-2 py-1"></td>
                  <td className="px-3 py-1"></td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                  <td className="px-2.5 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Summary: Right-Aligned Clean Ledger */}
          <div className="flex shrink-0 justify-end pt-1 pb-1 text-xs">
            {/* Right: Clean Accounting Tax & Total Ledger */}
            <div className="w-64 shrink-0 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">Taxable Amount</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  ₹{formatCurrency(calculations.totalTaxable)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>CGST ({data.gstRate / 2}%)</span>
                <span className="font-medium text-slate-800 tabular-nums">
                  ₹{formatCurrency(calculations.cgst)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>SGST ({data.gstRate / 2}%)</span>
                <span className="font-medium text-slate-800 tabular-nums">
                  ₹{formatCurrency(calculations.sgst)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Round Off</span>
                <span className="font-medium text-slate-800 tabular-nums">
                  {calculations.roundOff > 0 ? "+" : ""}
                  {formatCurrency(calculations.roundOff)}
                </span>
              </div>

              {/* Grand Total Row */}
              <div className="flex items-center justify-between pt-2 pb-1 text-slate-950">
                <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                  Grand Total
                </span>
                <span className="text-lg font-bold tracking-tight text-slate-950 tabular-nums">
                  ₹{calculations.grandTotal.toLocaleString("en-IN")}.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Footer: Clear, Readable Bank Details (Left) + Signatory Block (Right) */}
        <div className="mt-auto flex shrink-0 items-end justify-between gap-6 border-t border-slate-200 pt-4 text-xs">
          {/* Left: Bank & Payment Details */}
          <div className="max-w-lg flex-1 space-y-2 text-xs">
            <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Bank &amp; Payment Details
            </span>

            <div>
              <span className="block text-[9.5px] font-semibold tracking-wider text-slate-500 uppercase">
                Account Name
              </span>
              <span className="block text-xs font-bold text-slate-900">
                {data.bankDetails.accountName}
              </span>
            </div>

            <div className="flex items-start gap-5">
              <div>
                <span className="block text-[9.5px] font-semibold tracking-wider text-slate-500 uppercase">
                  Bank Name
                </span>
                <span className="block text-xs font-bold text-slate-800">
                  {data.bankDetails.bankName}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] font-semibold tracking-wider text-slate-500 uppercase">
                  Account Number
                </span>
                <span className="block font-mono text-xs font-bold tracking-wider text-slate-950">
                  {data.bankDetails.accountNo}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] font-semibold tracking-wider text-slate-500 uppercase">
                  IFSC Code
                </span>
                <span className="block font-mono text-xs font-bold tracking-wider text-slate-950">
                  {data.bankDetails.ifscCode}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Authorised Signatory */}
          <div className="flex flex-col items-end text-right">
            <div className="text-xs font-medium text-slate-700">For Rainbow Offset Printer</div>
            <div className="h-12" />
            <div className="w-36 border-t border-slate-300 pt-1.5 text-right">
              <span className="text-[11.5px] font-medium text-slate-600">Authorised Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
