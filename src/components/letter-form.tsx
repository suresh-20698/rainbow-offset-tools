import { Sliders, Sparkles, User, PenTool } from "lucide-react";
import React from "react";

import type { LetterData } from "../types/document";
import { DEFAULT_LETTER } from "../utils/storage";

interface LetterFormProps {
  data: LetterData;
  onChange: (updated: LetterData) => void;
}

export const LetterForm: React.FC<LetterFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof LetterData>(field: K, value: LetterData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const loadSampleLetter = () => {
    onChange({ ...DEFAULT_LETTER });
  };

  return (
    <div className="space-y-5 font-sans text-gray-800">
      {/* 1. Recipient Details */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
            <User className="h-4 w-4" />
            Recipient &amp; Reference Information
          </h2>
          <button
            type="button"
            onClick={loadSampleLetter}
            className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-indigo-600 transition hover:text-indigo-800"
            title="Populate fields with sample letter"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            Load Sample
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="refNo" className="block text-xs font-medium text-gray-700">
              Reference / Letter No.
            </label>
            <input
              id="refNo"
              type="text"
              placeholder="e.g. RO/2026-27/L-101"
              value={data.refNo}
              onChange={(e) => updateField("refNo", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="letterDate" className="block text-xs font-medium text-gray-700">
              Date
            </label>
            <input
              id="letterDate"
              type="date"
              value={data.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientName" className="block text-xs font-medium text-gray-700">
              Recipient Name / Attention
            </label>
            <input
              id="recipientName"
              type="text"
              placeholder="e.g. The General Manager / Mr. Suresh"
              value={data.recipientName}
              onChange={(e) => updateField("recipientName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientOrg" className="block text-xs font-medium text-gray-700">
              Organization / Company
            </label>
            <input
              id="recipientOrg"
              type="text"
              placeholder="e.g. Hotel Gnanam"
              value={data.recipientOrg}
              onChange={(e) => updateField("recipientOrg", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="recipientAddress" className="block text-xs font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="recipientAddress"
              rows={2}
              placeholder="e.g. 84/14-A, Anna Salai Keelavasal, Thanjavur - 613001"
              value={data.recipientAddress}
              onChange={(e) => updateField("recipientAddress", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Letter Content */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase">
            <PenTool className="h-4 w-4" />
            Letter Content &amp; Subject
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="space-y-1">
            <label htmlFor="subject" className="block text-xs font-medium text-gray-700">
              Subject Line
            </label>
            <input
              id="subject"
              type="text"
              placeholder="e.g. Quotation and Confirmation for Offset Printing Stationery"
              value={data.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="salutation" className="block text-xs font-medium text-gray-700">
              Salutation
            </label>
            <input
              id="salutation"
              type="text"
              placeholder="e.g. Dear Sir / Madam,"
              value={data.salutation}
              onChange={(e) => updateField("salutation", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="letterBody" className="block text-xs font-medium text-gray-700">
              Letter Body Paragraphs
            </label>
            <textarea
              id="letterBody"
              rows={8}
              placeholder="Type letter content here. Paragraphs and line breaks will be preserved."
              value={data.body}
              onChange={(e) => updateField("body", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 font-sans text-sm leading-relaxed text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Letterhead Calibration */}
      <section className="space-y-3.5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-pink-700 uppercase">
            <Sliders className="h-4 w-4" />
            Letterhead Print Offset Calibration
          </h2>
          <span className="rounded border border-pink-200 bg-pink-50 px-2 py-0.5 text-xs font-bold text-pink-700">
            {data.letterheadOffsetMm} mm
          </span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-gray-700">
              <span>Top Blank Margin Offset</span>
              <span className="font-normal text-gray-500">Default: 55mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={data.letterheadOffsetMm}
              onChange={(e) => updateField("letterheadOffsetMm", Number(e.target.value))}
              className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-pink-600"
            />
            <p className="text-[11px] text-gray-500">
              Adjust this slider to align the printed letter beneath the physical pre-printed logo
              on your A4 letterhead paper.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-xs font-medium text-gray-700">
            <input
              type="checkbox"
              checked={data.showDigitalHeader}
              onChange={(e) => updateField("showDigitalHeader", e.target.checked)}
              className="cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-0"
            />
            <span>Render digital Rainbow Offset banner (for PDF download / blank paper)</span>
          </label>
        </div>
      </section>
    </div>
  );
};
