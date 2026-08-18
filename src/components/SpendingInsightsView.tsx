import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  ShieldAlert,
  RotateCcw,
  Tag,
  Store,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR } from "../types";

export const SpendingInsightsView: React.FC = () => {
  const { purchases, stats, setActiveTab } = useApp();

  // Category Aggregation
  const catTotals: Record<string, number> = {};
  purchases.forEach((p) => {
    const cat = p.category || "Others";
    catTotals[cat] = (catTotals[cat] || 0) + (p.amount || 0);
  });

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

  const categoryData = Object.entries(catTotals).map(([name, value], i) => ({
    name,
    value,
    color: COLORS[i % COLORS.length],
  }));

  // Merchant Aggregation
  const merchantTotals: Record<string, number> = {};
  purchases.forEach((p) => {
    const seller = p.seller || "Other";
    merchantTotals[seller] = (merchantTotals[seller] || 0) + (p.amount || 0);
  });

  const merchantData = Object.entries(merchantTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Monthly Spending Trend Data
  const monthlyData = [
    { month: "Apr '26", amount: 18500 },
    { month: "May '26", amount: 34200 },
    { month: "Jun '26", amount: 28900 },
    { month: "Jul '26", amount: 89682 },
    { month: "Aug '26", amount: 38485 },
  ];

  return (
    <div id="spending-insights-view" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Spending & Warranty Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI-driven financial breakdown, tax analysis, and proactive warranty savings
        </p>
      </div>

      {/* 4 Automatic Smart Insight Cards (from problem statement!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. SAVINGS */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>💰 SAVINGS</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
            "You could save ₹2,340 by reviewing warranty extension options before expiry."
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold">2 products eligible</div>
        </div>

        {/* 2. SPENDING */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <Wallet className="w-4 h-4 text-indigo-600" />
            <span>📊 SPENDING</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
            "Electronics account for 54% of your total purchases portfolio."
          </p>
          <div className="mt-2 text-[11px] text-indigo-600 font-bold">
            Total {formatINR(stats.totalSpent)}
          </div>
        </div>

        {/* 3. WARRANTY */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>⚠️ WARRANTY</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
            "3 warranties expire within the next 30 days. Protect hardware with AppleCare+ / Croma Care."
          </p>
          <div className="mt-2 text-[11px] text-amber-700 font-bold">Action recommended</div>
        </div>

        {/* 4. RETURNS */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>↩ RETURNS</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
            "1 product is approaching its final return deadline (Sony WH-1000XM5 in 2 days)."
          </p>
          <div className="mt-2 text-[11px] text-rose-600 font-bold">Inspect before cutoff</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Purchase Velocity</h3>
              <p className="text-[11px] text-slate-500 font-medium">Spending trends over the last 5 months</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
              Avg ₹41k/mo
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), "Spent"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Category Allocation</h3>
              <p className="text-[11px] text-slate-500 font-medium">Distribution by product category</p>
            </div>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), "Spent"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span className="text-slate-600 font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-slate-900">{formatINR(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Merchant Share */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top Merchants & Platforms</h3>
            <p className="text-[11px] text-slate-500 font-medium">Where you buy the most</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {merchantData.map((m) => {
            const pct = Math.round((m.value / (stats.totalSpent || 1)) * 100);
            return (
              <div key={m.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{m.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    {pct}%
                  </span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-2">{formatINR(m.value)}</div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
