import React from "react";

import type { LetterData } from "../types/document";
import { formatDateToIndian } from "../utils/calculations";

interface LetterPreviewProps {
  data: LetterData;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ data }) => {
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
      {/* 1. Optional Digital Header */}
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

      {/* 2. Main Executive Letter Content */}
      <div className="flex flex-1 flex-col justify-between font-sans text-[13px] leading-relaxed text-slate-900">
        <div className="space-y-3.5">
          {/* Reference & Date Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
            <div>
              {data.refNo ? (
                <span className="font-semibold text-slate-700">REF: {data.refNo}</span>
              ) : (
                <span className="text-slate-400">REF: —</span>
              )}
            </div>
            <div className="font-semibold text-slate-900">
              <span className="text-slate-500">Date: </span>
              <span className="font-bold text-slate-950">{formatDateToIndian(data.date)}</span>
            </div>
          </div>

          {/* Recipient / To Block */}
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">To:</div>
            <div className="space-y-0.5 border-l-2 border-slate-300 pl-2.5">
              {data.recipientName && (
                <div className="text-[13.5px] font-bold text-slate-950">{data.recipientName}</div>
              )}
              {data.recipientOrg && (
                <div className="text-xs font-semibold text-slate-800">{data.recipientOrg}</div>
              )}
              {data.recipientAddress && (
                <div className="pt-0.5 text-xs leading-relaxed whitespace-pre-line text-slate-600">
                  {data.recipientAddress}
                </div>
              )}
            </div>
          </div>

          {/* Subject Line */}
          {data.subject && (
            <div className="rounded-r-md border-l-4 border-indigo-600 bg-slate-50 px-2.5 py-1.5">
              <span className="mr-1.5 text-[11.5px] font-bold tracking-wide text-slate-950 uppercase">
                Subject:
              </span>
              <span className="text-[12.5px] font-semibold text-slate-900">{data.subject}</span>
            </div>
          )}

          {/* Salutation */}
          <div className="text-[13px] font-semibold text-slate-900">
            {data.salutation || "Dear Sir / Madam,"}
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-3 text-justify text-[13px] leading-relaxed font-normal whitespace-pre-line text-slate-800">
            {data.body || (
              <span className="text-slate-400 italic">
                Type your letter content in the editor on the left...
              </span>
            )}
          </div>
        </div>

        {/* 3. Signatory Footer Block */}
        <div className="mt-auto flex items-end justify-between border-t border-slate-200 pt-4 text-xs">
          <div className="text-[11px] text-slate-400">
            Rainbow Offset Printing Publishing & Trading • Official Correspondence
          </div>

          <div className="w-56 shrink-0 space-y-10 text-right">
            <div className="space-y-1">
              <div className="text-xs text-slate-600">Yours faithfully,</div>
              <div className="text-xs font-bold tracking-wide text-slate-900 uppercase">
                {data.signatoryCompany || "For Rainbow Offset Printer"}
              </div>
            </div>

            <div className="border-t border-slate-400 pt-1 text-[11.5px] font-medium text-slate-700">
              {data.signatoryTitle || "Authorised Signature"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
