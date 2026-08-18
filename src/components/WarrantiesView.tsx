import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Clock,
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDisplayDate, getWarrantyStatus, formatINR } from "../types";

export const WarrantiesView: React.FC = () => {
  const { purchases, setSelectedPurchase, setIsAddModalOpen, setActiveTab } = useApp();
  const [filter, setFilter] = useState<"all" | "active" | "expiring_soon" | "expired">("all");

  const warrantyItems = purchases.map((p) => {
    const statusInfo = getWarrantyStatus(p.purchaseDate, p.warrantyMonths);
    return {
      purchase: p,
      ...statusInfo,
    };
  });

  const filteredItems = warrantyItems.filter((item) => {
    if (filter === "active") return item.status === "active";
    if (filter === "expiring_soon") return item.status === "expiring_soon";
    if (filter === "expired") return item.status === "expired";
    return true;
  });

  const activeCount = warrantyItems.filter((i) => i.status === "active").length;
  const expiringCount = warrantyItems.filter((i) => i.status === "expiring_soon").length;
  const expiredCount = warrantyItems.filter((i) => i.status === "expired").length;

  return (
    <div id="warranties-view" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Warranty Lifecycle Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automatic tracking of manufacturer warranties, expiration reminders, and claim documentation
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 active:scale-98 transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Warranty</span>
        </button>
      </div>

      {/* Top Warranty Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter("all")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            filter === "all" ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Warranties</span>
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {warrantyItems.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all registered devices</p>
        </div>

        <div
          onClick={() => setFilter("expiring_soon")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            filter === "expiring_soon"
              ? "border-amber-500 ring-2 ring-amber-500/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Expiring Soon (&lt; 30d)</span>
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 mt-2">{expiringCount}</div>
          <p className="text-[11px] text-amber-600 mt-0.5">Action needed to claim or extend</p>
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
            <span className="text-xs font-semibold text-emerald-700">Fully Active Coverage</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{activeCount}</div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Under verified manufacturer guarantee</p>
        </div>
      </div>

      {/* Warranty Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All ({warrantyItems.length})
        </button>
        <button
          onClick={() => setFilter("expiring_soon")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "expiring_soon"
              ? "bg-white text-amber-800 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Expiring Soon ({expiringCount})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "active"
              ? "bg-white text-emerald-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "expired"
              ? "bg-white text-slate-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Expired ({expiredCount})
        </button>
      </div>

      {/* Warranties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(({ purchase: p, status, statusLabel, daysRemaining, expiryDate }) => {
          const totalDays = p.warrantyMonths * 30.5;
          const progressPercent = Math.max(0, Math.min(100, Math.round((daysRemaining / totalDays) * 100)));

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-white border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                status === "expiring_soon"
                  ? "border-amber-300 ring-1 ring-amber-200"
                  : status === "expired"
                  ? "border-slate-200 opacity-80"
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      status === "expiring_soon"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : status === "expired"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {status === "expiring_soon"
                      ? "⚠️ Expiring Soon"
                      : status === "expired"
                      ? "Expired"
                      : "✓ Active Warranty"}
                  </span>

                  <span className="text-xs font-bold text-slate-900">
                    {formatINR(p.amount)}
                  </span>
                </div>

                {/* Product Name */}
                <h3
                  onClick={() => setSelectedPurchase(p)}
                  className="text-base font-bold text-slate-900 mt-3 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {p.product}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Purchased from <strong className="text-slate-700">{p.seller}</strong> on{" "}
                  {formatDisplayDate(p.purchaseDate)}
                </p>

                {/* Timeline Bar */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Warranty Duration</span>
                    <span className="font-bold text-slate-800">
                      {p.warrantyMonths >= 12
                        ? `${p.warrantyMonths / 12} Year (${p.warrantyMonths}m)`
                        : `${p.warrantyMonths} Months`}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === "expiring_soon"
                          ? "bg-amber-500"
                          : status === "expired"
                          ? "bg-slate-400"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">
                      Expires: {expiryDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span
                      className={`font-bold ${
                        status === "expiring_soon"
                          ? "text-amber-800"
                          : status === "expired"
                          ? "text-slate-400"
                          : "text-emerald-700"
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Warranty Ended"}
                    </span>
                  </div>
                </div>

                {/* AI Warranty Advice */}
                {p.aiInsight && (
                  <div className="mt-3 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{p.aiInsight}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPurchase(p)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>View Full Invoice & Specs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab("assistant")}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Claim Help
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
