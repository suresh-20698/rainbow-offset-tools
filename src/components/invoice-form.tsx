import {
  Plus,
  Trash2,
  Sliders,
  Building2,
  ReceiptText,
  Calculator,
  Layers,
  Sparkles,
} from "lucide-react";
import React from "react";

import type { InvoiceData, LineItem } from "../types/document";
import { DEFAULT_INVOICE } from "../utils/storage";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    updateField("items", updatedItems);
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      particulars: "",
      quantity: 100,
      totalPrice: "",
    };
    updateField("items", [...data.items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (data.items.length === 1) {
      updateField("items", [
        { id: Date.now().toString(), particulars: "", quantity: "", totalPrice: "" },
      ]);
      return;
    }
    const updatedItems = data.items.filter((_, i) => i !== index);
    updateField("items", updatedItems);
  };

  const loadSampleItems = () => {
    onChange({
      ...data,
      clientName: DEFAULT_INVOICE.clientName,
      clientAddress: DEFAULT_INVOICE.clientAddress,
      clientGst: DEFAULT_INVOICE.clientGst,
      billNo: DEFAULT_INVOICE.billNo,
      items: DEFAULT_INVOICE.items,
    });
  };

  return (
    <div className="space-y-5 font-sans text-gray-800">
      {/* 1. Client & Bill Information */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
            <Building2 className="h-4 w-4" />
            Client &amp; Bill Information
          </h2>
          <button
            type="button"
            onClick={loadSampleItems}
            className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-indigo-600 transition hover:text-indigo-800"
            title="Populate fields with sample data"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            Load Sample
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="clientName" className="block text-xs font-medium text-gray-700">
              Client / Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="clientName"
              type="text"
              placeholder="e.g. HOTEL GNANAM"
              value={data.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="clientAddress" className="block text-xs font-medium text-gray-700">
              Client Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="clientAddress"
              rows={2}
              placeholder="e.g. 84/14-A, ANNA SALAI KEELAVASAL, THANJAVUR - 613001"
              value={data.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="clientGst" className="block text-xs font-medium text-gray-700">
              Client GSTIN <span className="font-normal text-gray-400">(Optional)</span>
            </label>
            <input
              id="clientGst"
              type="text"
              placeholder="e.g. 33AADFH1286J1ZG"
              value={data.clientGst}
              onChange={(e) => updateField("clientGst", e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="billNo" className="block text-xs font-medium text-gray-700">
              Bill / Invoice No.
            </label>
            <input
              id="billNo"
              type="text"
              placeholder="e.g. 16"
              value={data.billNo}
              onChange={(e) => updateField("billNo", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="invoiceDate" className="block text-xs font-medium text-gray-700">
              Invoice Date
            </label>
            <input
              id="invoiceDate"
              type="date"
              value={data.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="stateCode" className="block text-xs font-medium text-gray-700">
              State Code
            </label>
            <input
              id="stateCode"
              type="text"
              value={data.stateCode}
              onChange={(e) => updateField("stateCode", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Tax Calculation Mode Switch */}
      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
          <Calculator className="h-4 w-4" />
          GST Calculation Mode
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Mode Option 1: Inclusive (Default) */}
          <button
            type="button"
            onClick={() => updateField("isGstInclusive", true)}
            className={`cursor-pointer rounded-lg border p-3 text-left transition ${
              data.isGstInclusive
                ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-1 ring-indigo-600"
                : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>GST Inclusive (Default)</span>
              {data.isGstInclusive && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Entered prices include 18% GST (e.g. ₹5,000 total = ₹4,237.29 base + ₹762.71 GST).
            </p>
          </button>

          {/* Mode Option 2: Exclusive */}
          <button
            type="button"
            onClick={() => updateField("isGstInclusive", false)}
            className={`cursor-pointer rounded-lg border p-3 text-left transition ${
              !data.isGstInclusive
                ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-1 ring-indigo-600"
                : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>GST Exclusive</span>
              {!data.isGstInclusive && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Entered prices are base amount; 18% GST is added on top (e.g. ₹700 base + ₹126 GST).
            </p>
          </button>
        </div>
      </section>

      {/* 3. Line Items Table */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase">
            <ReceiptText className="h-4 w-4" />
            Line Items ({data.items.length})
          </h2>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {data.items.map((item, index) => {
            const qty = typeof item.quantity === "number" ? item.quantity : 0;
            const price = typeof item.totalPrice === "number" ? item.totalPrice : 0;
            const unitRate = qty > 0 && price > 0 ? (price / qty).toFixed(2) : "0.00";

            return (
              <div
                key={item.id || index}
                className="flex flex-col items-start gap-2.5 rounded-lg border border-gray-200 bg-gray-50/40 p-2.5 shadow-2xs transition hover:border-gray-300 hover:bg-white sm:flex-row sm:items-center"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-200 text-[11px] font-bold text-gray-700">
                  {index + 1}
                </div>

                {/* Particulars */}
                <div className="w-full flex-1 sm:w-auto">
                  <input
                    type="text"
                    placeholder="Particulars (e.g. Visiting card, Letter pad)"
                    value={item.particulars}
                    onChange={(e) => handleItemChange(index, "particulars", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Quantity */}
                <div className="w-24 shrink-0">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-center text-xs font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Total Price Entered */}
                <div className="w-32 shrink-0">
                  <div className="relative">
                    <span className="absolute top-1.5 left-2.5 text-xs text-gray-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Total ₹"
                      value={item.totalPrice}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "totalPrice",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="w-full rounded-md border border-gray-300 bg-white py-1.5 pr-2 pl-6 text-right text-xs font-bold text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Derived Rate indicator */}
                <div
                  className="hidden w-24 truncate text-right text-[11px] font-medium text-gray-500 lg:block"
                  title="Derived unit rate"
                >
                  ₹{unitRate}/ea
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="cursor-pointer rounded-md p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Pre-printed Letterhead Offset Calibration */}
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
              Adjust this slider to align the printed document beneath the physical pre-printed logo
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

      {/* 5. Static Bank & Signatory Notice */}
      <section className="space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-600">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <Layers className="h-3.5 w-3.5 text-indigo-600" />
          <span>Static Bank &amp; Signatory Information</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Pre-configured to <strong className="text-gray-900">Indian Bank</strong>, Account:{" "}
          <span className="font-semibold text-gray-900">{data.bankDetails.accountNo}</span>, IFSC:{" "}
          <span className="font-semibold text-gray-900">{data.bankDetails.ifscCode}</span> for{" "}
          <strong className="text-gray-900">Rainbow Offset Printer</strong>.
        </p>
      </section>
    </div>
  );
};
