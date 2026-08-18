import React from "react";
import {
  X,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR, formatDisplayDate, getWarrantyStatus, getReturnStatus } from "../types";

export const ReceiptDetailModal: React.FC = () => {
  const { selectedPurchase, setSelectedPurchase, setActiveTab } = useApp();

  if (!selectedPurchase) return null;

  const p = selectedPurchase;
  const warInfo = getWarrantyStatus(p.purchaseDate, p.warrantyMonths);
  const retInfo = getReturnStatus(p.purchaseDate, p.returnDays);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="receipt-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="receipt-detail-modal-card"
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tax Invoice & Warranty Sheet</h2>
              <p className="text-xs text-slate-500 font-medium">Verified Invoice #{p.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPurchase(null)}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Printable Invoice Slip Box */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 font-mono text-xs space-y-4">
            {/* Store Banner */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h3 className="font-extrabold text-base text-slate-900 tracking-wider uppercase">
                {p.seller}
              </h3>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">OFFICIAL TAX INVOICE & PROOF OF PURCHASE</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-600 font-sans">
                <span>INV: #{p.invoiceNumber}</span>
                <span>•</span>
                <span>DATE: {p.purchaseDate}</span>
              </div>
            </div>

            {/* Product item breakdown */}
            <div className="space-y-2 py-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 max-w-xs">{p.product}</span>
                <span className="font-bold text-slate-900">{formatINR(p.amount - p.gst)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Category</span>
                <span>{p.category}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>GST (18%)</span>
                <span>{formatINR(p.gst)}</span>
              </div>
              <div className="flex justify-between text-slate-900 text-sm font-black pt-2 border-t border-slate-300">
                <span>TOTAL AMOUNT PAID</span>
                <span>{formatINR(p.amount)}</span>
              </div>
            </div>

            {/* Policy Summary */}
            <div className="pt-3 border-t border-dashed border-slate-300 grid grid-cols-2 gap-2 text-[11px] font-sans">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Warranty Expiry</span>
                <strong className="text-emerald-700">{formatDisplayDate(warInfo.expiryStr)}</strong>
                <div className="text-[10px] text-slate-500">{warInfo.statusLabel}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Return Deadline</span>
                <strong className="text-amber-800">{formatDisplayDate(retInfo.deadlineStr)}</strong>
                <div className="text-[10px] text-slate-500">{retInfo.statusLabel}</div>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          {p.aiInsight && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-950">AI Purchase Analysis:</strong>
                <p className="mt-0.5 leading-relaxed">{p.aiInsight}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedPurchase(null);
              setActiveTab("assistant");
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI about this bill</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
