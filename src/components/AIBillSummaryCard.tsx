import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Shield,
  RotateCcw,
  ArrowUpRight,
  Layers,
  Clock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import DisplayCards, { DisplayCardProps } from "./ui/display-cards";

export const AIBillSummaryCard: React.FC = () => {
  const { purchases, setSelectedPurchase, setIsAddModalOpen } = useApp();
  const [viewMode, setViewMode] = useState<"summary" | "stack">("summary");

  // Pick OnePlus 12R or the most recent purchase
  const featured =
    purchases.find((p) => p.product.toLowerCase().includes("oneplus")) ||
    purchases[0] || {
      id: "pur-demo",
      product: "OnePlus 12R (256GB)",
      seller: "Reliance Digital",
      invoiceNumber: "RD1245789",
      purchaseDate: "2026-07-18",
      amount: 47198,
      gst: 7199,
      category: "Electronics",
      warrantyMonths: 12,
      returnDays: 7,
      confidence: 97,
      aiInsight:
        "This purchase includes a 1-year manufacturer warranty and is currently within the return window.",
    };

  // Stacked display cards derived from real purchases
  const topPurchases = purchases.slice(0, 3);
  const displayCardsData: DisplayCardProps[] = topPurchases.map((p, idx) => ({
    icon:
      idx === 0 ? (
        <Sparkles className="size-4 text-white" />
      ) : idx === 1 ? (
        <Shield className="size-4 text-white" />
      ) : (
        <Clock className="size-4 text-white" />
      ),
    title: p.seller,
    description: `${p.product} (₹${p.amount.toLocaleString("en-IN")})`,
    date: `${p.warrantyMonths}M Warranty • ${p.purchaseDate}`,
    iconClassName:
      idx === 0
        ? "bg-[#2563EB] text-white"
        : idx === 1
        ? "bg-[#059669] text-white"
        : "bg-[#D97706] text-white",
    titleClassName:
      idx === 0
        ? "text-[#2563EB] font-bold"
        : idx === 1
        ? "text-[#059669] font-bold"
        : "text-[#D97706] font-bold",
    onClick: () => setSelectedPurchase(p),
    className:
      idx === 0
        ? "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-slate-200 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
        : idx === 1
        ? "[grid-area:stack] translate-x-8 sm:translate-x-14 translate-y-6 sm:translate-y-8 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-slate-200 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
        : "[grid-area:stack] translate-x-16 sm:translate-x-28 translate-y-12 sm:translate-y-16 hover:translate-y-6",
  }));

  return (
    <div
      id="card-ai-bill-summary"
      className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#0B0F19] flex items-center gap-1.5">
                AI Receipt Intelligence
              </h3>
              <p className="text-[11px] text-[#5F6673]">Automated multimodal invoice parsing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-[#F3F4F6] p-0.5 rounded-[8px] border border-[#E5E7EB] text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode("summary")}
                className={`px-2.5 py-1 rounded-[6px] font-medium transition-all cursor-pointer ${
                  viewMode === "summary"
                    ? "bg-[#FFFFFF] text-[#0B0F19] shadow-xs font-semibold"
                    : "text-[#5F6673] hover:text-[#0B0F19]"
                }`}
              >
                Summary
              </button>
              <button
                type="button"
                onClick={() => setViewMode("stack")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-[6px] font-medium transition-all cursor-pointer ${
                  viewMode === "stack"
                    ? "bg-[#FFFFFF] text-[#0B0F19] shadow-xs font-semibold"
                    : "text-[#5F6673] hover:text-[#0B0F19]"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>3D Stack</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[10px] font-semibold text-[#065F46]">
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
              <span>Extracted</span>
            </div>
          </div>
        </div>

        {/* View Mode: Interactive Stack Cards */}
        {viewMode === "stack" ? (
          <div className="py-6 flex flex-col items-center justify-center relative z-10">
            <p className="text-[11px] text-[#5F6673] font-medium mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              Hover to expand stack • Click any invoice to inspect
            </p>
            <div className="w-full max-w-md flex items-center justify-center pt-2 pb-6">
              <DisplayCards cards={displayCardsData} />
            </div>
          </div>
        ) : (
          /* View Mode: Detailed Featured Summary */
          <div className="mt-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#2563EB] uppercase tracking-wide">
                  Latest Analyzed Receipt
                </span>
                <h4 className="text-[15px] font-bold text-[#0B0F19] mt-0.5">{featured.product}</h4>
                <p className="text-[12px] text-[#5F6673]">
                  {featured.seller} • #{featured.invoiceNumber}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#5F6673]">Total Amount</span>
                <div className="text-[16px] font-bold text-[#0B0F19]">
                  ₹{featured.amount.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-[#059669] font-medium">
                  Incl. GST ₹{featured.gst.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 p-3 rounded-[10px] bg-[#F7F8FA] border border-[#E5E7EB] text-xs">
              <div>
                <span className="text-[10px] text-[#8A919D] block">Purchase Date</span>
                <span className="font-semibold text-[#0B0F19]">
                  {featured.purchaseDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A919D] block">Category</span>
                <span className="font-semibold text-[#0B0F19]">{featured.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A919D] block flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#2563EB]" /> Warranty
                </span>
                <span className="font-semibold text-[#059669]">
                  {featured.warrantyMonths >= 12
                    ? `${featured.warrantyMonths / 12} Year`
                    : `${featured.warrantyMonths} Months`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A919D] block flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 text-[#D97706]" /> Return Window
                </span>
                <span className="font-semibold text-[#D97706]">{featured.returnDays} Days</span>
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="mt-3 p-3 rounded-[10px] bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong className="text-[#0B0F19]">AI Insight:</strong>{" "}
                {featured.aiInsight ||
                  "This purchase includes a 1-year manufacturer warranty and is currently within the return window."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
        <button
          id="btn-view-full-bill"
          onClick={() => setSelectedPurchase(featured as any)}
          className="text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Full Bill</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-[11px] font-medium px-3 py-1 rounded-[8px] bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#0B0F19] border border-[#E5E7EB] transition-all cursor-pointer"
        >
          + Upload Another Bill
        </button>
      </div>
    </div>
  );
};
