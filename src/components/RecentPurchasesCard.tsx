import React from "react";
import { ShoppingBag, ArrowRight, ShieldCheck, ChevronRight, Store } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR, formatDisplayDate } from "../types";

export const RecentPurchasesCard: React.FC = () => {
  const { purchases, setSelectedPurchase, setActiveTab } = useApp();

  return (
    <div
      id="card-recent-purchases"
      className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#F7F8FA] text-[#0B0F19] flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#0B0F19]">Recent Purchases</h3>
              <p className="text-[11px] text-[#5F6673] font-medium">Logged receipts and invoices</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#0B0F19] font-medium">
            {purchases.length} Total
          </span>
        </div>

        <div className="mt-3 divide-y divide-[#E5E7EB]">
          {purchases.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPurchase(p)}
              className="py-2.5 px-1.5 -mx-1.5 rounded-[8px] hover:bg-[#F7F8FA] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#5F6673] shrink-0 group-hover:border-[#2563EB]/40 group-hover:text-[#2563EB] transition-colors">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[12px] font-bold text-[#0B0F19] truncate group-hover:text-[#2563EB] transition-colors">
                    {p.product}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#5F6673] mt-0.5">
                    <span className="font-medium text-[#0B0F19]">{p.seller}</span>
                    <span>•</span>
                    <span>{formatDisplayDate(p.purchaseDate)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center gap-2">
                <div>
                  <div className="text-[12px] font-bold text-[#0B0F19]">{formatINR(p.amount)}</div>
                  <div className="text-[10px] text-[#059669] font-medium flex items-center justify-end gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{p.warrantyMonths}m war.</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8A919D] group-hover:text-[#0B0F19] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        id="btn-view-all-purchases"
        onClick={() => setActiveTab("purchases")}
        className="mt-4 pt-3 border-t border-[#E5E7EB] text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center justify-between group transition-colors cursor-pointer"
      >
        <span>View all purchases</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
