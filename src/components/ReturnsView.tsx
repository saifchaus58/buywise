import React, { useState } from "react";
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Store,
  ArrowRight,
  Package,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDisplayDate, getReturnStatus, formatINR } from "../types";

export const ReturnsView: React.FC = () => {
  const { purchases, setSelectedPurchase, setActiveTab } = useApp();
  const [filter, setFilter] = useState<"all" | "active" | "expiring_soon" | "expired">("all");

  const returnItems = purchases.map((p) => {
    const statusInfo = getReturnStatus(p.purchaseDate, p.returnDays);
    return {
      purchase: p,
      ...statusInfo,
    };
  });

  const filteredItems = returnItems.filter((item) => {
    if (filter === "active") return item.status === "active";
    if (filter === "expiring_soon") return item.status === "expiring_soon";
    if (filter === "expired") return item.status === "expired";
    return true;
  });

  const urgentCount = returnItems.filter((i) => i.status === "expiring_soon").length;
  const activeCount = returnItems.filter((i) => i.status === "active").length;
  const expiredCount = returnItems.filter((i) => i.status === "expired").length;

  return (
    <div id="returns-view" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Returns & Refund Deadlines
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track store return windows so you never miss an eligible exchange or refund
          </p>
        </div>
      </div>

      {/* Urgent Alert Banner if any return window closing soon */}
      {urgentCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {urgentCount} Product{urgentCount > 1 ? "s" : ""} Approaching Return Cutoff!
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                Sony WH-1000XM5 return window closes in 2 days. Inspect items before return policy expires.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter("expiring_soon")}
            className="px-3.5 py-1.5 rounded-xl bg-white text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors shrink-0"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter("all")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            filter === "all" ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">All Tracked Items</span>
            <RotateCcw className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{returnItems.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Full return policy history</p>
        </div>

        <div
          onClick={() => setFilter("expiring_soon")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            filter === "expiring_soon"
              ? "border-rose-500 ring-2 ring-rose-500/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600">Return Ending Soon (&lt; 3d)</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">{urgentCount}</div>
          <p className="text-[11px] text-rose-500 mt-0.5">Critical return window</p>
        </div>

        <div
          onClick={() => setFilter("active")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            filter === "active"
              ? "border-emerald-500 ring-2 ring-emerald-500/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Return Window Open</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{activeCount}</div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Eligible for hassle-free returns</p>
        </div>
      </div>

      {/* Return Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(({ purchase: p, status, statusLabel, daysRemaining, deadlineDate }) => {
          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-white border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                status === "expiring_soon"
                  ? "border-rose-300 ring-1 ring-rose-200"
                  : status === "expired"
                  ? "border-slate-200 opacity-80"
                  : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      status === "expiring_soon"
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : status === "expired"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {status === "expiring_soon"
                      ? "🚨 Return Ending Soon"
                      : status === "expired"
                      ? "Return Window Closed"
                      : "✓ Return Available"}
                  </span>

                  <span className="text-xs font-bold text-slate-900">{formatINR(p.amount)}</span>
                </div>

                <h3
                  onClick={() => setSelectedPurchase(p)}
                  className="text-base font-bold text-slate-900 mt-3 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {p.product}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seller: <strong className="text-slate-700">{p.seller}</strong> • Invoice #{p.invoiceNumber}
                </p>

                {/* Return Details Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Return Policy</span>
                    <span className="font-bold text-slate-800">{p.returnDays} Days from Delivery</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Cutoff Date</span>
                    <span className="font-semibold text-slate-900">
                      {deadlineDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                    <span className="text-slate-500">Time Remaining</span>
                    <span
                      className={`font-bold ${
                        status === "expiring_soon"
                          ? "text-rose-600"
                          : status === "expired"
                          ? "text-slate-400"
                          : "text-emerald-700"
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days left` : "Window Closed"}
                    </span>
                  </div>
                </div>

                {/* Checklist */}
                <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Keep retail box, tags & accessories in original condition</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Direct merchant claim with Invoice #{p.invoiceNumber}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPurchase(p)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>View Full Receipt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab("assistant")}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Return Steps
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
