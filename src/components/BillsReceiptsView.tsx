import React, { useState } from "react";
import {
  ReceiptText,
  FileText,
  Download,
  Search,
  ExternalLink,
  Plus,
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR, formatDisplayDate } from "../types";

export const BillsReceiptsView: React.FC = () => {
  const { purchases, setIsAddModalOpen, setSelectedPurchase } = useApp();
  const [filterSeller, setFilterSeller] = useState("All");

  const sellers = ["All", ...Array.from(new Set(purchases.map((p) => p.seller)))];

  const filtered = purchases.filter(
    (p) => filterSeller === "All" || p.seller === filterSeller
  );

  const handleExportCSV = () => {
    const headers = "Product,Seller,Invoice Number,Purchase Date,Amount,GST,Category,Warranty (Months),Return Window (Days)\n";
    const rows = purchases
      .map(
        (p) =>
          `"${p.product}","${p.seller}","${p.invoiceNumber}","${p.purchaseDate}",${p.amount},${p.gst},"${p.category}",${p.warrantyMonths},${p.returnDays}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BuyWise_Receipts_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="bills-receipts-view" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Bills & Receipt Vault
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cloud-synced archive of verified digital tax invoices, warranty receipts, and proof of purchase
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Bill</span>
          </button>
        </div>
      </div>

      {/* Seller filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {sellers.map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeller(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterSeller === s
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPurchase(p)}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Top Invoice Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">#{p.invoiceNumber}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{p.seller}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>OCR Verified</span>
                </div>
              </div>

              {/* Product */}
              <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {p.product}
              </h3>

              {/* Receipt Visual Simulator */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>DATE:</span>
                  <span className="font-semibold text-slate-700">{p.purchaseDate}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%):</span>
                  <span className="font-semibold text-slate-700">{formatINR(p.gst)}</span>
                </div>
                <div className="flex justify-between text-slate-900 pt-1 border-t border-slate-200 font-bold">
                  <span>TOTAL:</span>
                  <span>{formatINR(p.amount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>View Full Document</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
