import React from "react";
import { Clock, ArrowRight, Shield, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";

export const UpcomingDeadlinesCard: React.FC = () => {
  const { setActiveTab } = useApp();

  const deadlines = [
    {
      id: "dl-1",
      product: "Sony WH-1000XM5",
      type: "Return window closes",
      date: "19 Aug 2026",
      daysLeft: 2,
      urgent: true,
      category: "return",
      seller: "Amazon",
    },
    {
      id: "dl-2",
      product: "Apple MacBook Air M2",
      type: "Warranty expires",
      date: "22 Aug 2026",
      daysLeft: 5,
      urgent: true,
      category: "warranty",
      seller: "Reliance Digital",
    },
    {
      id: "dl-3",
      product: "Samsung 55\" QLED TV",
      type: "Warranty expires",
      date: "05 Sep 2026",
      daysLeft: 19,
      urgent: false,
      category: "warranty",
      seller: "Croma",
    },
  ];

  return (
    <div
      id="card-upcoming-deadlines"
      className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#F7F8FA] text-[#0B0F19] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#0B0F19]">Upcoming Deadlines</h3>
              <p className="text-[11px] text-[#5F6673] font-medium">Automatic urgency tracking</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#0B0F19] font-medium">
            3 Next
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {deadlines.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.category === "return" ? "returns" : "warranties")}
              className="p-2.5 rounded-[10px] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F7F8FA] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-[8px] shrink-0 flex items-center justify-center ${
                    item.category === "return"
                      ? "bg-[#FEE2E2] text-[#DC2626]"
                      : "bg-[#FEF3C7] text-[#D97706]"
                  }`}
                >
                  {item.category === "return" ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[12px] font-semibold text-[#0B0F19] truncate group-hover:text-[#2563EB] transition-colors">
                    {item.product}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#5F6673] mt-0.5">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-[6px] border ${
                    item.urgent
                      ? "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]"
                      : "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                  }`}
                >
                  {item.daysLeft}d left
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setActiveTab("warranties")}
        className="mt-4 pt-3 border-t border-[#E5E7EB] text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center justify-between group transition-colors cursor-pointer"
      >
        <span>View all warranty alerts</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
