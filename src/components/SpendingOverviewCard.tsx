import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR } from "../types";

export const SpendingOverviewCard: React.FC = () => {
  const { purchases, stats, setActiveTab } = useApp();
  const [timeframe, setTimeframe] = useState("This Month");

  // Calculate actual category spending
  const categoryTotals: Record<string, number> = {};
  purchases.forEach((p) => {
    const cat = p.category || "Others";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (p.amount || 0);
  });

  const total = stats.totalSpent || 1;

  // Modern crisp palette
  const COLORS = ["#2563EB", "#0B0F19", "#059669", "#D97706", "#64748B", "#8B5CF6"];

  const data = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    percentage: Math.round((value / total) * 100),
    color: COLORS[index % COLORS.length],
  }));

  // Fallback if empty
  const displayData =
    data.length > 0
      ? data
      : [
          { name: "Electronics", value: 68400, percentage: 54, color: "#2563EB" },
          { name: "Appliances", value: 28900, percentage: 23, color: "#0B0F19" },
          { name: "Accessories", value: 15260, percentage: 12, color: "#059669" },
          { name: "Others", value: 12000, percentage: 11, color: "#D97706" },
        ];

  return (
    <div
      id="card-spending-overview"
      className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Header with Dropdown */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-[13px] font-bold text-[#0B0F19]">Spending Overview</h3>
            <p className="text-[11px] text-[#5F6673] font-medium">Categorized expense analysis</p>
          </div>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-[11px] font-semibold text-[#0B0F19] bg-[#F7F8FA] hover:bg-[#F3F4F6] px-2.5 py-1 rounded-[8px] border border-[#E5E7EB] cursor-pointer focus:outline-hidden"
            >
              <option value="This Month">This Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
        </div>

        {/* Donut Chart with Center Total */}
        <div className="relative h-44 w-full my-2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: any) => [formatINR(Number(val)), "Spent"]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              />
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-bold text-[#0B0F19] leading-none">
              {formatINR(stats.totalSpent)}
            </span>
            <span className="text-[10px] text-[#8A919D] font-medium mt-0.5">Total Spent</span>
          </div>
        </div>

        {/* Category List */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {displayData.slice(0, 4).map((cat) => (
            <div
              key={cat.name}
              className="p-2 rounded-[8px] bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                ></span>
                <span className="text-[11px] font-medium text-[#0B0F19] truncate">{cat.name}</span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] font-bold text-[#0B0F19]">{cat.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        id="btn-view-detailed-breakdown"
        onClick={() => setActiveTab("insights")}
        className="mt-4 pt-3 border-t border-[#E5E7EB] text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center justify-between group transition-colors cursor-pointer"
      >
        <span>View detailed breakdown</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
