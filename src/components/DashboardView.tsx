import React from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Clock,
  Wallet,
  TrendingUp,
  Plus,
  Sparkles,
  Bot,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR } from "../types";
import { ActionCenter } from "./ActionCenter";
import { UpcomingDeadlinesCard } from "./UpcomingDeadlinesCard";
import { AIBillSummaryCard } from "./AIBillSummaryCard";
import { SpendingOverviewCard } from "./SpendingOverviewCard";
import { RecentPurchasesCard } from "./RecentPurchasesCard";

export const DashboardView: React.FC = () => {
  const { stats, setIsAddModalOpen, setActiveTab } = useApp();

  const statCards = [
    {
      id: "stat-total-purchases",
      title: "Total Purchases",
      value: stats.totalPurchasesCount,
      subtext: "+3 this month",
      trend: "+14%",
      icon: ShoppingBag,
      color: "text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]",
    },
    {
      id: "stat-active-warranties",
      title: "Active Warranties",
      value: stats.activeWarrantiesCount,
      subtext: "100% verified coverage",
      trend: "Optimal",
      icon: ShieldCheck,
      color: "text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]",
    },
    {
      id: "stat-expiring-soon",
      title: "Expiring Soon",
      value: stats.expiringSoonCount,
      subtext: "Action needed < 30 days",
      trend: "Urgent",
      icon: Clock,
      color: "text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]",
      onClick: () => setActiveTab("warranties"),
    },
    {
      id: "stat-total-spent",
      title: "Total Spent",
      value: formatINR(stats.totalSpent),
      subtext: "Across all categories",
      trend: "Avg ₹24k/item",
      icon: Wallet,
      color: "text-[#0B0F19] bg-[#F7F8FA] border-[#E5E7EB]",
    },
  ];

  return (
    <div id="dashboard-view-container" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="section-label mb-1">Overview</div>
          <h1 className="text-2xl font-bold text-[#0B0F19] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#5F6673] mt-0.5">
            Your centralized intelligence hub for bills, warranties, and return windows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("assistant")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFFFF] hover:bg-[#F7F8FA] text-[#0B0F19] border border-[#E5E7EB] rounded-[10px] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#2563EB]" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[10px] text-xs font-semibold shadow-xs active:scale-98 transition-all cursor-pointer hover:-translate-y-[1px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Purchase</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              onClick={card.onClick}
              className={`p-4 rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all ${
                card.onClick ? "cursor-pointer hover:border-[#F59E0B]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#5F6673]">{card.title}</span>
                <div
                  className={`w-7 h-7 rounded-[8px] flex items-center justify-center border ${card.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#0B0F19] tracking-tight">
                  {card.value}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    card.trend === "Urgent"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : "bg-[#F3F4F6] text-[#5F6673]"
                  }`}
                >
                  {card.trend}
                </span>
              </div>
              <p className="text-[11px] text-[#8A919D] mt-1 font-medium">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Action Center Banner */}
      <ActionCenter />

      {/* Bento Grid: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): AI Bill Summary & Spending Overview */}
        <div className="lg:col-span-7 space-y-6">
          <AIBillSummaryCard />
          <SpendingOverviewCard />
        </div>

        {/* Right Column (5 cols): Upcoming Deadlines & Recent Purchases */}
        <div className="lg:col-span-5 space-y-6">
          <UpcomingDeadlinesCard />
          <RecentPurchasesCard />
        </div>
      </div>
    </div>
  );
};
