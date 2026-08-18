import React, { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  RotateCcw,
  Store,
  FileText,
  Calendar,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR, formatDisplayDate, CategoryType, getWarrantyStatus, getReturnStatus } from "../types";

export const PurchasesView: React.FC = () => {
  const { purchases, searchQuery, setSearchQuery, setIsAddModalOpen, setSelectedPurchase, deletePurchase } =
    useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "name">("date");

  const categories = ["All", "Electronics", "Appliances", "Accessories", "Home & Kitchen", "Others"];

  // Filter and Sort
  const filteredPurchases = purchases
    .filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      }
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return a.product.localeCompare(b.product);
    });

  return (
    <div id="purchases-view" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="section-label mb-1">Records</div>
          <h1 className="text-2xl font-bold text-[#0B0F19] tracking-tight">
            Purchases & Invoices
          </h1>
          <p className="text-sm text-[#5F6673] mt-0.5">
            Manage all scanned receipts, warranty terms, and active return windows
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[10px] text-xs font-semibold shadow-xs active:scale-98 transition-all shrink-0 self-start sm:self-auto cursor-pointer hover:-translate-y-[1px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Purchase</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0B0F19] text-white"
                  : "bg-[#F7F8FA] hover:bg-[#F3F4F6] text-[#5F6673]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#5F6673] font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold text-[#0B0F19] bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] px-2.5 py-1.5 rounded-[8px] cursor-pointer focus:outline-hidden"
          >
            <option value="date">Most Recent</option>
            <option value="amount">Highest Amount</option>
            <option value="name">Product Name</option>
          </select>
        </div>
      </div>

      {/* Purchase Cards Grid */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] p-8">
          <ShoppingBag className="w-12 h-12 text-[#8A919D] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B0F19]">No purchases found</h3>
          <p className="text-xs text-[#5F6673] max-w-sm mx-auto mt-1">
            {searchQuery
              ? `No results matching "${searchQuery}". Try a different keyword.`
              : "Upload your first receipt to start managing warranties & returns automatically."}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-[8px] shadow-xs hover:bg-[#1D4ED8] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Receipt</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPurchases.map((p) => {
            const warInfo = getWarrantyStatus(p.purchaseDate, p.warrantyMonths);
            const retInfo = getReturnStatus(p.purchaseDate, p.returnDays);

            return (
              <div
                key={p.id}
                className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Merchant & Price */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#0B0F19] shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#0B0F19] block truncate">
                          {p.seller}
                        </span>
                        <span className="text-[10px] text-[#8A919D] font-medium">
                          #{p.invoiceNumber}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-[#0B0F19]">
                        {formatINR(p.amount)}
                      </div>
                      <span className="text-[10px] text-[#8A919D]">
                        GST: {formatINR(p.gst)}
                      </span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => setSelectedPurchase(p)}
                    className="text-sm font-bold text-[#0B0F19] mt-3 hover:text-[#2563EB] transition-colors cursor-pointer line-clamp-1"
                  >
                    {p.product}
                  </h3>

                  {/* Badges: Category & Purchase Date */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#F3F4F6] text-[#0B0F19]">
                      {p.category}
                    </span>
                    <span className="text-[11px] text-[#5F6673] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8A919D]" />
                      {formatDisplayDate(p.purchaseDate)}
                    </span>
                  </div>

                  {/* Status Pills */}
                  <div className="mt-4 pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-2 text-xs">
                    {/* Warranty Status */}
                    <div className="p-2 rounded-[8px] bg-[#F7F8FA] border border-[#E5E7EB]">
                      <div className="text-[10px] font-semibold text-[#5F6673] flex items-center gap-1 mb-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                        <span>Warranty</span>
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          warInfo.status === "expired"
                            ? "text-[#8A919D]"
                            : warInfo.status === "expiring_soon"
                            ? "text-[#D97706]"
                            : "text-[#059669]"
                        }`}
                      >
                        {warInfo.daysRemaining > 0
                          ? `${warInfo.daysRemaining}d left`
                          : "Expired"}
                      </div>
                    </div>

                    {/* Return Status */}
                    <div className="p-2 rounded-[8px] bg-[#F7F8FA] border border-[#E5E7EB]">
                      <div className="text-[10px] font-semibold text-[#5F6673] flex items-center gap-1 mb-0.5">
                        <RotateCcw className="w-3 h-3 text-[#D97706]" />
                        <span>Return</span>
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          retInfo.status === "expired"
                            ? "text-[#8A919D]"
                            : retInfo.status === "expiring_soon"
                            ? "text-[#DC2626]"
                            : "text-[#D97706]"
                        }`}
                      >
                        {retInfo.daysRemaining > 0
                          ? `${retInfo.daysRemaining}d left`
                          : "Closed"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPurchase(p)}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </button>

                  <button
                    onClick={() => deletePurchase(p.id)}
                    className="text-[#8A919D] hover:text-[#DC2626] p-1 rounded-md transition-colors cursor-pointer"
                    title="Delete purchase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
