import { FileText, Receipt, Printer, Download, Upload, RotateCcw, PlusCircle } from "lucide-react";
import React, { useRef } from "react";

import type { DocumentType } from "../types/document";

interface HeaderProps {
  currentType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
  onNewDocument: (type: DocumentType) => void;
  onSaveJson: () => void;
  onLoadJson: (file: File) => void;
  onPrint: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentType,
  onTypeChange,
  onNewDocument,
  onSaveJson,
  onLoadJson,
  onPrint,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadJson(file);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 font-sans shadow-sm sm:px-6">
      {/* Brand & Type Tabs */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500 p-[1.5px] shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
              <span className="text-base">🌈</span>
            </div>
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight text-gray-900 sm:text-base">
              Rainbow Offset
            </span>
            <span className="block text-[10px] font-medium text-gray-500">
              Print &amp; Invoice Tools
            </span>
          </div>
        </div>

        {/* Document Switcher Tabs */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-0.5">
          <button
            type="button"
            onClick={() => onTypeChange("invoice")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              currentType === "invoice"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Receipt className="h-3.5 w-3.5 text-indigo-600" />
            <span>Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => onTypeChange("letter")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              currentType === "letter"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-indigo-600" />
            <span>Letter</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Hidden File Input for JSON import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => onNewDocument(currentType)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          title="Create a fresh document"
        >
          <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden md:inline">New</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          title="Open a saved .json draft file"
        >
          <Upload className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden md:inline">Open Draft</span>
        </button>

        <button
          type="button"
          onClick={onSaveJson}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          title="Save draft to disk as .json (replaces .cdr)"
        >
          <Download className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden md:inline">Save Draft</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          title="Reset to sample data"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
          title="Print to A4 Letterhead or Download PDF"
        >
          <Printer className="h-4 w-4" />
          <span>Print A4 / PDF</span>
        </button>
      </div>
    </header>
  );
};
