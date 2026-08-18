import React from "react";
import { AlertCircle, Clock, Sparkles, ArrowRight, ShieldAlert, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ActionCenter: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div id="action-center-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#0B0F19] flex items-center gap-1.5">
            Action Center
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#0B0F19] font-medium border border-[#E5E7EB]">
            3 items require attention
          </span>
        </div>
        <button
          onClick={() => setActiveTab("warranties")}
          className="text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Return Window */}
        <div
          id="action-card-return"
          onClick={() => setActiveTab("returns")}
          className="p-4 rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#EF4444]/40 transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="w-7 h-7 rounded-[8px] bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-semibold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
              2 days left
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DC2626]">
              Return window closing
            </span>
            <h4 className="text-[13px] font-bold text-[#0B0F19] mt-0.5 group-hover:text-[#2563EB] transition-colors">
              Sony WH-1000XM5
            </h4>
            <p className="text-[12px] text-[#5F6673] mt-1 leading-snug">
              Amazon purchase (₹29,990). Verify accessories before return cutoff.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#2563EB]">
            <span>Check Return Options</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Warranty */}
        <div
          id="action-card-warranty"
          onClick={() => setActiveTab("warranties")}
          className="p-4 rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#F59E0B]/50 transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="w-7 h-7 rounded-[8px] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-semibold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              5 days left
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D97706]">
              Warranty expiring
            </span>
            <h4 className="text-[13px] font-bold text-[#0B0F19] mt-0.5 group-hover:text-[#2563EB] transition-colors">
              Apple MacBook Air M2
            </h4>
            <p className="text-[12px] text-[#5F6673] mt-1 leading-snug">
              Reliance Digital invoice #RD-APL-88412. Hardware coverage ends Aug 22.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#2563EB]">
            <span>View Claims Guide</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Extended Warranty Offer */}
        <div
          id="action-card-savings"
          onClick={() => setActiveTab("insights")}
          className="p-4 rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#2563EB]/40 transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="w-7 h-7 rounded-[8px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
              Save ₹4,500
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
              Extended protection
            </span>
            <h4 className="text-[13px] font-bold text-[#0B0F19] mt-0.5 group-hover:text-[#2563EB] transition-colors">
              Samsung 55" QLED TV
            </h4>
            <p className="text-[12px] text-[#5F6673] mt-1 leading-snug">
              Eligible for direct manufacturer brand warranty extension at 35% discount.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#2563EB]">
            <span>Explore Coverage</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
