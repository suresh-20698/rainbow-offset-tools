import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Scan,
  SlidersHorizontal,
  ChevronLeft,
  PanelLeftOpen,
  PanelLeftClose,
  Printer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [zoomLevel, setZoomLevel] = useState<number>(80); // % zoom for preview
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true); // Slide-out settings drawer
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage on change
  useEffect(() => {
    saveInvoiceToStorage(invoiceData);
  }, [invoiceData]);

  useEffect(() => {
    saveLetterToStorage(letterData);
  }, [letterData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFitPage = () => {
    setZoomLevel(80);
    showToast("Zoom reset to Fit Page (80%)");
  };

  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
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
        date: "",
        isGstInclusive: false,
        gstRate: 18,
        enableGst: true,
        letterheadOffsetMm: 55,
        showDigitalHeader: false,
        bankDetails: DEFAULT_BANK_DETAILS,
        items: [
          {
            id: Date.now().toString(),
            particulars: "",
            quantity: "",
            unitPrice: "",
            totalPrice: "",
          },
        ],
      };
      setInvoiceData(blankInvoice);
      showToast("Created new blank Invoice");
    } else {
      const blankLetter: LetterData = {
        documentType: "letter",
        date: "",
        refNo: "",
        recipientName: "",
        recipientOrg: "",
        recipientAddress: "",
        subject: "",
        salutation: "",
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
      showToast("Reset Invoice to blank form");
    } else {
      setLetterData(DEFAULT_LETTER);
      showToast("Reset Letter to blank form");
    }
  };

  const handlePrint = () => {
    const currentData = docType === "invoice" ? invoiceData : letterData;
    const printTitle = getDocumentFilename(currentData);
    const originalTitle = document.title;
    document.title = printTitle;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="app-root flex h-screen w-screen flex-col overflow-hidden bg-white font-sans text-gray-900">
      {/* 1. Global Navigation Header */}
      <Header
        currentType={docType}
        onTypeChange={setDocType}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={handleToggleDrawer}
        onNewDocument={handleNewDocument}
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
        onPrint={handlePrint}
        onReset={handleReset}
      />

      {/* 2. Canvas-First Workspace with Slide-Out Settings Drawer */}
      <div className="workspace-container relative flex flex-1 overflow-hidden bg-slate-100/90">
        {/* Slide-out Form Drawer (No-print) */}
        <aside
          className={`no-print z-20 flex h-full flex-col border-r border-gray-200 bg-white shadow-xl transition-all duration-300 ease-in-out ${
            isDrawerOpen
              ? "w-full max-w-[90vw] shrink-0 opacity-100 sm:w-[480px] md:w-[540px] lg:w-[600px] xl:w-[660px] 2xl:w-[720px]"
              : "pointer-events-none w-0 -translate-x-full overflow-hidden opacity-0"
          }`}
        >
          {/* Drawer Top Bar */}
          <div className="flex h-13 shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 sm:px-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-primary-600" />
              <h2 className="text-sm font-bold text-gray-900">
                {docType === "invoice" ? "Invoice Settings & Items" : "Letter Pad Settings"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500 shadow-2xs">
                Autosaved
              </span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                title="Collapse Drawer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Form Area */}
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
            {docType === "invoice" ? (
              <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
            ) : (
              <LetterForm data={letterData} onChange={setLetterData} />
            )}
          </div>
        </aside>

        {/* Hero: Centered A4 Document Canvas */}
        <main
          ref={previewWrapperRef}
          className="a4-preview-wrapper relative flex flex-1 flex-col items-center overflow-auto p-4 sm:p-8"
        >
          {/* Floating Canvas Controls Toolbar (No-print) */}
          <div className="no-print sticky top-3 z-10 mb-6 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white/95 px-3.5 py-1.5 text-xs text-gray-700 shadow-lg backdrop-blur-md">
            {/* Drawer Toggle Pill Button */}
            <button
              type="button"
              onClick={handleToggleDrawer}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                isDrawerOpen
                  ? "text-gray-700 hover:bg-gray-100"
                  : "bg-primary-600 text-white shadow-xs hover:bg-primary-700"
              }`}
              title={isDrawerOpen ? "Hide Settings Drawer" : "Open Settings Drawer"}
            >
              {isDrawerOpen ? (
                <>
                  <PanelLeftClose className="h-4 w-4 text-gray-500" />
                  <span className="hidden sm:inline">Hide Panel</span>
                </>
              ) : (
                <>
                  <PanelLeftOpen className="h-4 w-4" />
                  <span>Edit Document</span>
                </>
              )}
            </button>

            <div className="mx-1 h-3.5 w-[1px] bg-gray-200" />

            {/* Zoom Controls */}
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(35, Math.round((z - 5) / 5) * 5))}
              className="cursor-pointer rounded p-1 transition hover:bg-gray-100 hover:text-gray-900"
              title="Zoom out (-5%)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-9 text-center text-[11px] font-bold text-gray-900">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(140, Math.round((z + 5) / 5) * 5))}
              className="cursor-pointer rounded p-1 transition hover:bg-gray-100 hover:text-gray-900"
              title="Zoom in (+5%)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="mx-1 h-3.5 w-[1px] bg-gray-200" />

            {/* Fit to Page Button */}
            <button
              type="button"
              onClick={handleFitPage}
              className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-primary-700"
              title="Fit entire page vertically and horizontally"
            >
              <Scan className="h-4 w-4 text-primary-600" />
              <span>Fit Page</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setZoomLevel(80);
                showToast("Zoom reset to 80%");
              }}
              className="cursor-pointer rounded p-1 transition hover:bg-gray-100 hover:text-gray-900"
              title="Reset Zoom to 80%"
            >
              <Maximize2 className="h-4 w-4 text-gray-500" />
            </button>

            <div className="mx-1 h-3.5 w-[1px] bg-gray-200" />

            {/* Direct Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-600 px-3.5 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-primary-700 active:scale-95"
              title="Print to A4 Letterhead or Save as PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Print A4</span>
            </button>
          </div>

          {/* Scalable Paper Canvas Container */}
          <div
            className="zoom-container flex origin-top justify-center pb-16 transition-transform"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {docType === "invoice" ? (
              <InvoicePreview data={invoiceData} />
            ) : (
              <LetterPreview data={letterData} />
            )}
          </div>
        </main>
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
