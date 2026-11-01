import {
  Plus,
  Trash2,
  Sliders,
  Building2,
  ReceiptText,
  Calculator,
  Landmark,
  Sparkles,
  Tag,
  Table,
  LayoutList,
} from "lucide-react";
import React from "react";

import type { InvoiceData, LineItem } from "../types/document";
import { formatCurrency } from "../utils/calculations";
import { SAMPLE_INVOICE } from "../utils/storage";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const [viewMode, setViewMode] = React.useState<"table" | "cards">(() => {
    return (localStorage.getItem("invoice_items_view_mode") as "table" | "cards") || "table";
  });

  const handleViewModeChange = (mode: "table" | "cards") => {
    setViewMode(mode);
    localStorage.setItem("invoice_items_view_mode", mode);
  };

  const itemsSubtotal = React.useMemo(() => {
    return data.items.reduce((sum, item) => {
      const val = typeof item.totalPrice === "number" ? item.totalPrice : 0;
      return sum + val;
    }, 0);
  }, [data.items]);

  const updateField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number | boolean,
  ) => {
    const updatedItems = [...data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    updateField("items", updatedItems);
  };

  const handleQuantityChange = (index: number, rawVal: string) => {
    const updatedItems = [...data.items];
    const item = { ...updatedItems[index] };

    if (rawVal === "") {
      item.quantity = "";
    } else {
      const qty = parseFloat(rawVal);
      item.quantity = isNaN(qty) ? "" : qty;

      const unitP =
        typeof item.unitPrice === "number" ? item.unitPrice : parseFloat(String(item.unitPrice));
      const totalP =
        typeof item.totalPrice === "number" ? item.totalPrice : parseFloat(String(item.totalPrice));

      if (!isNaN(qty) && qty > 0) {
        if (!isNaN(unitP) && unitP > 0) {
          item.totalPrice = Math.round(qty * unitP * 100) / 100;
        } else if (!isNaN(totalP) && totalP > 0) {
          item.unitPrice = Math.round((totalP / qty) * 100) / 100;
        }
      }
    }
    updatedItems[index] = item;
    updateField("items", updatedItems);
  };

  const handleUnitPriceChange = (index: number, rawVal: string) => {
    const updatedItems = [...data.items];
    const item = { ...updatedItems[index] };

    if (rawVal === "") {
      item.unitPrice = "";
    } else {
      const unitP = parseFloat(rawVal);
      item.unitPrice = isNaN(unitP) ? "" : unitP;

      const qty =
        typeof item.quantity === "number" ? item.quantity : parseFloat(String(item.quantity));
      if (!isNaN(qty) && qty > 0 && !isNaN(unitP)) {
        item.totalPrice = Math.round(qty * unitP * 100) / 100;
      }
    }
    updatedItems[index] = item;
    updateField("items", updatedItems);
  };

  const handleTotalPriceChange = (index: number, rawVal: string) => {
    const updatedItems = [...data.items];
    const item = { ...updatedItems[index] };

    if (rawVal === "") {
      item.totalPrice = "";
    } else {
      const totalP = parseFloat(rawVal);
      item.totalPrice = isNaN(totalP) ? "" : totalP;

      const qty =
        typeof item.quantity === "number" ? item.quantity : parseFloat(String(item.quantity));
      if (!isNaN(qty) && qty > 0 && !isNaN(totalP)) {
        item.unitPrice = Math.round((totalP / qty) * 100) / 100;
      }
    }
    updatedItems[index] = item;
    updateField("items", updatedItems);
  };

  const handleToggleFlatCharge = (index: number) => {
    const updatedItems = [...data.items];
    const item = { ...updatedItems[index] };
    const nextFlat = !item.isFlatCharge;
    item.isFlatCharge = nextFlat;
    if (nextFlat) {
      item.quantity = "";
      item.unitPrice = "";
    }
    updatedItems[index] = item;
    updateField("items", updatedItems);
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      particulars: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
      isFlatCharge: false,
    };
    updateField("items", [...data.items, newItem]);
  };

  const handleAddAmountOnlyItem = () => {
    const newAmountOnlyItem: LineItem = {
      id: Date.now().toString(),
      particulars: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
      isFlatCharge: true,
    };
    updateField("items", [...data.items, newAmountOnlyItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (data.items.length === 1) {
      updateField("items", [
        {
          id: Date.now().toString(),
          particulars: "",
          quantity: "",
          unitPrice: "",
          totalPrice: "",
          isFlatCharge: false,
        },
      ]);
      return;
    }
    const updatedItems = data.items.filter((_, i) => i !== index);
    updateField("items", updatedItems);
  };

  const loadSampleItems = () => {
    onChange({
      ...data,
      clientName: SAMPLE_INVOICE.clientName,
      clientAddress: SAMPLE_INVOICE.clientAddress,
      clientGst: SAMPLE_INVOICE.clientGst,
      billNo: SAMPLE_INVOICE.billNo,
      items: SAMPLE_INVOICE.items,
    });
  };

  return (
    <div className="space-y-5 font-sans text-gray-800">
      {/* 1. GST Calculation */}
      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary-700 uppercase">
            <Calculator className="h-4.5 w-4.5" />
            GST Calculation
          </h2>

          {/* Switch Button for Enable/Disable GST */}
          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs font-semibold ${
                data.enableGst !== false ? "font-bold text-primary-700" : "text-gray-500"
              }`}
            >
              {data.enableGst !== false ? "GST Enabled" : "GST Disabled"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={data.enableGst !== false}
              onClick={() => updateField("enableGst", data.enableGst === false ? true : false)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none ${
                data.enableGst !== false ? "bg-primary-600" : "bg-gray-300"
              }`}
              title="Toggle GST Calculation on/off"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  data.enableGst !== false ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {data.enableGst !== false ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Mode Option 1: Inclusive (Default) */}
            <button
              type="button"
              onClick={() => updateField("isGstInclusive", true)}
              className={`cursor-pointer rounded-lg border p-3 text-left transition ${
                data.isGstInclusive
                  ? "border-primary-600 bg-primary-50/70 text-gray-950 shadow-sm ring-1 ring-primary-600"
                  : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>GST Inclusive (Default)</span>
                {data.isGstInclusive && <span className="h-2 w-2 rounded-full bg-primary-600" />}
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
                  ? "border-primary-600 bg-primary-50/70 text-gray-950 shadow-sm ring-1 ring-primary-600"
                  : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>GST Exclusive</span>
                {!data.isGstInclusive && <span className="h-2 w-2 rounded-full bg-primary-600" />}
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Entered prices are base amount; 18% GST is added on top (e.g. ₹700 base + ₹126 GST).
              </p>
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
            <span className="font-semibold">GST Disabled:</span> Line items will be billed without
            tax (Non-GST / 0% Tax).
          </div>
        )}
      </section>

      {/* 2. Client & Bill Information */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary-700 uppercase">
            <Building2 className="h-4.5 w-4.5" />
            Client &amp; Bill Information
          </h2>
          <button
            type="button"
            onClick={loadSampleItems}
            className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-primary-600 transition hover:text-primary-800"
            title="Populate fields with sample data"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-600" />
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
            />
          </div>

          {data.enableGst !== false && (
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
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
              />
            </div>
          )}

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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="invoiceDate" className="block text-xs font-medium text-gray-700">
                Invoice Date <span className="font-normal text-gray-400">(Optional)</span>
              </label>
              {data.date && (
                <button
                  type="button"
                  onClick={() => updateField("date", "")}
                  className="cursor-pointer text-[10px] font-medium text-rose-600 hover:text-rose-800 hover:underline"
                >
                  Clear Date
                </button>
              )}
            </div>
            <input
              id="invoiceDate"
              type="date"
              value={data.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Line Items Table */}
      <section className="space-y-3.5 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <h2 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary-700 uppercase">
              <ReceiptText className="h-4.5 w-4.5" />
              Line Items ({data.items.length})
            </h2>

            {/* View Mode Toggle: Table (Compact) vs Cards */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-100/90 p-0.5 text-[10.5px] font-semibold">
              <button
                type="button"
                onClick={() => handleViewModeChange("table")}
                className={`flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 transition ${
                  viewMode === "table"
                    ? "bg-white font-bold text-primary-700 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Spreadsheet Table View (Ultra-compact 1-row layout)"
              >
                <Table className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("cards")}
                className={`flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 transition ${
                  viewMode === "cards"
                    ? "bg-white font-bold text-primary-700 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Card View (2-Row Compact)"
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAddAmountOnlyItem}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 shadow-2xs transition hover:bg-amber-100 active:scale-95"
              title="Add a generic flat / lump-sum charge (no Qty, Rate, or GST)"
            >
              <Tag className="h-4 w-4 text-amber-700" />
              <span className="hidden sm:inline">+ Flat Charge</span>
              <span className="sm:hidden">+ Flat</span>
            </button>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
          /* Table View: Ultra-Compact Spreadsheet-Style 1-Row Grid */
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-2xs">
            <table className="w-full min-w-[500px] text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/90 text-[10.5px] font-bold tracking-wider text-gray-600 uppercase">
                  <th className="w-8 py-2 pl-2.5 text-center">#</th>
                  <th className="px-2 py-2">Particulars / Job Description</th>
                  <th className="w-24 px-1 py-2 text-right">Per Unit (₹)</th>
                  <th className="w-18 px-1 py-2 text-center">Qty</th>
                  <th className="w-26 px-1.5 py-2 text-right">Total (₹)</th>
                  <th className="w-8 py-2 pr-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((item, index) => {
                  const isFlatCharge = Boolean(item.isFlatCharge);
                  const qty =
                    !isFlatCharge && typeof item.quantity === "number" ? item.quantity : 0;
                  const price = typeof item.totalPrice === "number" ? item.totalPrice : 0;
                  const displayUnitPrice =
                    item.unitPrice !== undefined && item.unitPrice !== ""
                      ? item.unitPrice
                      : !isFlatCharge && qty > 0 && price > 0
                        ? Math.round((price / qty) * 100) / 100
                        : "";

                  return (
                    <tr
                      key={item.id || index}
                      className={`group transition hover:bg-gray-50/80 ${
                        isFlatCharge ? "bg-amber-50/25" : "bg-white"
                      }`}
                    >
                      <td className="py-1.5 pl-2.5 text-center text-[11px] font-bold text-gray-400 group-hover:text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1.5">
                          {isFlatCharge && (
                            <button
                              type="button"
                              onClick={() => handleToggleFlatCharge(index)}
                              className="shrink-0 cursor-pointer rounded bg-amber-100 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-800 hover:bg-amber-200"
                              title="Flat charge. Click to switch to standard."
                            >
                              FLAT
                            </button>
                          )}
                          <input
                            type="text"
                            placeholder={
                              isFlatCharge
                                ? "Charge description (e.g. Courier, Delivery, Designing)"
                                : "Particulars / Line item description"
                            }
                            value={item.particulars}
                            onChange={(e) => handleItemChange(index, "particulars", e.target.value)}
                            className="w-full rounded border border-gray-200 bg-gray-50/40 px-2 py-1 text-xs font-semibold text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </td>

                      <td className="px-1 py-1.5">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          disabled={isFlatCharge}
                          placeholder={isFlatCharge ? "—" : "0.00"}
                          value={displayUnitPrice}
                          onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                          className={`w-full rounded border px-2 py-1 text-right text-xs font-semibold transition focus:outline-none ${
                            isFlatCharge
                              ? "cursor-not-allowed border-gray-100 bg-gray-100/60 text-gray-400"
                              : "border-gray-200 bg-white text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                          }`}
                        />
                      </td>

                      <td className="px-1 py-1.5">
                        <input
                          type="number"
                          min="1"
                          step="any"
                          disabled={isFlatCharge}
                          placeholder={isFlatCharge ? "—" : "0"}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          className={`w-full rounded border px-1.5 py-1 text-center text-xs font-semibold transition focus:outline-none ${
                            isFlatCharge
                              ? "cursor-not-allowed border-gray-100 bg-gray-100/60 text-gray-400"
                              : "border-gray-200 bg-white text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                          }`}
                        />
                      </td>

                      <td className="px-1.5 py-1.5">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="0.00"
                          value={item.totalPrice}
                          onChange={(e) => handleTotalPriceChange(index, e.target.value)}
                          className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-right text-xs font-bold text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
                        />
                      </td>

                      <td className="py-1.5 pr-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="cursor-pointer rounded p-1 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View: Compact 2-Row Sleek Cards */
          <div className="space-y-2">
            {data.items.map((item, index) => {
              const isFlatCharge = Boolean(item.isFlatCharge);
              const qty = !isFlatCharge && typeof item.quantity === "number" ? item.quantity : 0;
              const price = typeof item.totalPrice === "number" ? item.totalPrice : 0;
              const displayUnitPrice =
                item.unitPrice !== undefined && item.unitPrice !== ""
                  ? item.unitPrice
                  : !isFlatCharge && qty > 0 && price > 0
                    ? Math.round((price / qty) * 100) / 100
                    : "";

              return (
                <div
                  key={item.id || index}
                  className={`space-y-1.5 rounded-lg border p-2.5 shadow-2xs transition hover:border-gray-300 ${
                    isFlatCharge
                      ? "border-amber-200 bg-amber-50/30 hover:bg-amber-50/60"
                      : "border-gray-200 bg-gray-50/40 hover:bg-white"
                  }`}
                >
                  {/* Row 1: S.No + Full Description + Type Pill + Trash */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                        isFlatCharge ? "bg-amber-200 text-amber-900" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      #{index + 1}
                    </span>

                    <input
                      type="text"
                      placeholder={
                        isFlatCharge
                          ? "Charge description (e.g. Courier, Delivery, Designing)"
                          : "Particulars / Line item description"
                      }
                      value={item.particulars}
                      onChange={(e) => handleItemChange(index, "particulars", e.target.value)}
                      className="min-w-0 flex-1 rounded border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleToggleFlatCharge(index)}
                      className={`shrink-0 cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-semibold transition ${
                        isFlatCharge
                          ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                      title="Click to toggle between Standard item and Flat charge"
                    >
                      {isFlatCharge ? "Flat" : "Std"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="cursor-pointer rounded p-1 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Row 2: 3 Inline Compact Columns */}
                  <div className="grid grid-cols-3 gap-2 pl-7.5">
                    <div className="flex items-center rounded border border-gray-200 bg-white px-2 py-0.5 text-xs focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600">
                      <span className="mr-1 shrink-0 text-[10.5px] font-medium text-gray-500">
                        Rate:
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        disabled={isFlatCharge}
                        placeholder={isFlatCharge ? "—" : "0.00"}
                        value={displayUnitPrice}
                        onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                        className={`w-full text-right text-xs font-semibold focus:outline-none ${
                          isFlatCharge ? "cursor-not-allowed text-gray-400" : "text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="flex items-center rounded border border-gray-200 bg-white px-2 py-0.5 text-xs focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600">
                      <span className="mr-1 shrink-0 text-[10.5px] font-medium text-gray-500">
                        Qty:
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        disabled={isFlatCharge}
                        placeholder={isFlatCharge ? "—" : "0"}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className={`w-full text-center text-xs font-semibold focus:outline-none ${
                          isFlatCharge ? "cursor-not-allowed text-gray-400" : "text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="flex items-center rounded border border-gray-200 bg-white px-2 py-0.5 text-xs focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600">
                      <span className="mr-1 shrink-0 text-[10.5px] font-bold text-gray-700">
                        Total ₹:
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={item.totalPrice}
                        onChange={(e) => handleTotalPriceChange(index, e.target.value)}
                        className="w-full text-right text-xs font-bold text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Subtotal & Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <span>Subtotal:</span>
            <span className="font-bold text-gray-900">₹{formatCurrency(itemsSubtotal)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddAmountOnlyItem}
              className="cursor-pointer text-[11px] font-medium text-amber-700 hover:text-amber-900 hover:underline"
            >
              + Flat Charge
            </button>
            <span className="text-gray-300">•</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex cursor-pointer items-center gap-1 text-[11px] font-bold text-primary-700 hover:text-primary-900 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Another Item</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Pre-printed Letterhead Offset Calibration */}
      <section className="space-y-3.5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary-700 uppercase">
            <Sliders className="h-4.5 w-4.5" />
            Letterhead Print Offset Calibration
          </h2>
          <span className="rounded border border-primary-200 bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700">
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
              className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-primary-600"
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
              className="cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-0"
            />
            <span>Render digital Rainbow Offset banner (for PDF download / blank paper)</span>
          </label>
        </div>
      </section>

      {/* 5. Static Bank & Signatory Notice */}
      <section className="space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-600">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <Landmark className="h-4 w-4 text-primary-600" />
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
