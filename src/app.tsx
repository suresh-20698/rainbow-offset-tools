import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Header } from "./components/header";
import { InvoiceForm } from "./components/invoice-form";
import { InvoicePreview } from "./components/invoice-preview";
import { LetterForm } from "./components/letter-form";
import { LetterPreview } from "./components/letter-preview";
import type { DocumentType, InvoiceData, LetterData } from "./types/document";
import {
  DEFAULT_BANK_DETAILS,
  DEFAULT_INVOICE,
  DEFAULT_LETTER,
  exportToJsonFile,
  getDocumentFilename,
  importFromJsonFile,
  loadInvoiceFromStorage,
  loadLetterFromStorage,
  saveInvoiceToStorage,
  saveLetterToStorage,
} from "./utils/storage";

export default function App() {
  const [docType, setDocType] = useState<DocumentType>("invoice");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(loadInvoiceFromStorage);
  const [letterData, setLetterData] = useState<LetterData>(loadLetterFromStorage);
  const [zoomLevel, setZoomLevel] = useState<number>(85); // % zoom for preview
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage on change
  useEffect(() => {
    saveInvoiceToStorage(invoiceData);
  }, [invoiceData]);

  useEffect(() => {
    saveLetterToStorage(letterData);
  }, [letterData]);

  // Dynamically synchronize document.title to Billcode_clientname_date for browser print & Save as PDF
  useEffect(() => {
    const currentData = docType === "invoice" ? invoiceData : letterData;
    document.title = getDocumentFilename(currentData);
  }, [docType, invoiceData, letterData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewDocument = (type: DocumentType) => {
    if (type === "invoice") {
      const blankInvoice: InvoiceData = {
        documentType: "invoice",
        clientName: "",
        clientAddress: "",
        clientGst: "",
        billNo: "",
        stateCode: "33",
        date: new Date().toISOString().split("T")[0],
        isGstInclusive: true,
        gstRate: 18,
        letterheadOffsetMm: 55,
        showDigitalHeader: false,
        bankDetails: DEFAULT_BANK_DETAILS,
        items: [{ id: Date.now().toString(), particulars: "", quantity: 100, totalPrice: "" }],
      };
      setInvoiceData(blankInvoice);
      showToast("Created new blank Invoice");
    } else {
      const blankLetter: LetterData = {
        documentType: "letter",
        date: new Date().toISOString().split("T")[0],
        refNo: "",
        recipientName: "",
        recipientOrg: "",
        recipientAddress: "",
        subject: "",
        salutation: "Dear Sir / Madam,",
        body: "",
        signatoryCompany: "For Rainbow Offset Printer",
        signatoryTitle: "Authorised Signature",
        letterheadOffsetMm: 55,
        showDigitalHeader: false,
      };
      setLetterData(blankLetter);
      showToast("Created new blank Letter");
    }
  };

  const handleSaveJson = () => {
    const currentData = docType === "invoice" ? invoiceData : letterData;
    exportToJsonFile(currentData);
    showToast("Draft downloaded as JSON file");
  };

  const handleLoadJson = (file: File) => {
    importFromJsonFile(
      file,
      (importedData) => {
        if (importedData.documentType === "invoice") {
          setInvoiceData(importedData as InvoiceData);
          setDocType("invoice");
          showToast("Loaded Invoice draft successfully");
        } else if (importedData.documentType === "letter") {
          setLetterData(importedData as LetterData);
          setDocType("letter");
          showToast("Loaded Letter draft successfully");
        }
      },
      (errMsg) => {
        showToast(`Error: ${errMsg}`);
      },
    );
  };

  const handleReset = () => {
    if (docType === "invoice") {
      setInvoiceData(DEFAULT_INVOICE);
      showToast("Reset Invoice to sample data");
    } else {
      setLetterData(DEFAULT_LETTER);
      showToast("Reset Letter to sample data");
    }
  };

  const handlePrint = () => {
    const currentData = docType === "invoice" ? invoiceData : letterData;
    document.title = getDocumentFilename(currentData);
    window.print();
  };

  return (
    <div className="app-root flex h-screen w-screen flex-col overflow-hidden bg-white font-sans text-gray-900">
      {/* 1. Global Navigation Header */}
      <Header
        currentType={docType}
        onTypeChange={setDocType}
        onNewDocument={handleNewDocument}
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
        onPrint={handlePrint}
        onReset={handleReset}
      />

      {/* 2. Main Workspace Split Layout */}
      <div className="workspace-container flex flex-1 overflow-hidden">
        {/* Left Column: Form Controls (No-print, plain white background) */}
        <div className="no-print w-full shrink-0 space-y-5 overflow-y-auto border-r border-gray-200 bg-gray-50/50 p-4 sm:p-6 md:w-[45%] lg:w-[40%] xl:w-[38%]">
          <div className="flex items-center justify-between pb-1">
            <h1 className="text-base font-bold tracking-tight text-gray-900">
              {docType === "invoice" ? "Invoice Form & Details" : "Letter Builder"}
            </h1>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500 shadow-2xs">
              Autosaved
            </span>
          </div>

          {docType === "invoice" ? (
            <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
          ) : (
            <LetterForm data={letterData} onChange={setLetterData} />
          )}
        </div>

        {/* Right Column: 1:1 Live A4 Preview & Zoom Controls */}
        <div className="a4-preview-wrapper relative flex flex-1 flex-col items-center overflow-auto bg-slate-100 p-4 sm:p-8">
          {/* Floating Zoom Toolbar (No-print) */}
          <div className="no-print sticky top-2 z-20 mb-4 flex items-center gap-1.5 rounded-full border border-gray-300 bg-white/95 px-3 py-1.5 text-xs text-gray-700 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="cursor-pointer rounded p-1 transition hover:bg-gray-100 hover:text-gray-900"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 text-[11px] font-bold text-gray-900">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="cursor-pointer rounded p-1 transition hover:bg-gray-100 hover:text-gray-900"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <div className="mx-1 h-3 w-[1px] bg-gray-200" />
            <button
              type="button"
              onClick={() => setZoomLevel(85)}
              className="cursor-pointer rounded p-1 transition hover:bg-gray-100 hover:text-gray-900"
              title="Reset Zoom to 85%"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Scalable Paper Canvas Container */}
          <div
            className="zoom-container flex origin-top justify-center pb-12 transition-transform"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {docType === "invoice" ? (
              <InvoicePreview data={invoiceData} />
            ) : (
              <LetterPreview data={letterData} />
            )}
          </div>
        </div>
      </div>

      {/* 3. Floating Toast Feedback */}
      {toastMessage && (
        <div className="toast-container no-print animate-fade-in fixed right-6 bottom-6 z-50 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
