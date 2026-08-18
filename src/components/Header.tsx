import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  ReceiptText,
  RotateCcw,
  PieChart,
  Bot,
  Bell,
  Settings,
  Search,
  Plus,
  Home,
  LogOut,
  User,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Shield,
  X,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ActiveTab } from "../types";
import { BottomNavBar, NavItem } from "./ui/bottom-nav-bar";

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsAddModalOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateToLanding,
    currentUser,
    logout,
    stats,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "purchases",
      label: "Purchases",
      icon: ShoppingBag,
      badge: stats.totalPurchasesCount > 0 ? stats.totalPurchasesCount : undefined,
      badgeColor: "bg-[#F3F4F6] text-[#0B0F19]",
    },
    {
      id: "warranties",
      label: "Warranties",
      icon: ShieldCheck,
      badge: stats.expiringSoonCount > 0 ? `${stats.expiringSoonCount}` : undefined,
      badgeColor: "bg-[#FEF3C7] text-[#92400E]",
    },
    {
      id: "bills",
      label: "Bills",
      icon: ReceiptText,
    },
    {
      id: "returns",
      label: "Returns",
      icon: RotateCcw,
      badge: stats.urgentReturnsCount > 0 ? `${stats.urgentReturnsCount}` : undefined,
      badgeColor: "bg-[#FEE2E2] text-[#991B1B]",
    },
    {
      id: "insights",
      label: "Insights",
      icon: PieChart,
    },
    {
      id: "assistant",
      label: "AI Chat",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      id: "notifications",
      label: "Alerts",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: "bg-[#EF4444] text-white",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const currentNavIndex = navItems.findIndex((item) => item.id === activeTab);
  const activeNavIndex = currentNavIndex >= 0 ? currentNavIndex : 0;

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BW";

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Brand Logo & Landing Quick Link */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B0F19] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#0B0F19] text-[15px] tracking-tight">
                BuyWise
              </span>
              <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.2 rounded-full border border-[#BFDBFE]">
                AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Landing page switch */}
            <button
              type="button"
              onClick={navigateToLanding}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#5F6673] hover:text-[#0B0F19] bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-full transition-colors cursor-pointer"
              title="Return to Public Landing Page"
            >
              <Home className="w-3 h-3" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-1.5 rounded-full border border-[#E5E7EB] text-[#5F6673] hover:text-[#0B0F19]"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Expandable Smooth Navigation Pill Bar */}
        <div className="w-full md:w-auto flex justify-center overflow-x-auto py-0.5 max-w-full">
          <BottomNavBar
            items={navItems}
            activeIndex={activeNavIndex}
            onSelect={(_, item) => {
              if (item.id) {
                setActiveTab(item.id as ActiveTab);
              }
            }}
            className="border-[#E5E7EB] bg-white/95"
          />
        </div>

        {/* Right: Search, Add Purchase, Notifications, & User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Global Search Bar (Desktop) */}
          <div className="hidden lg:block relative w-48 xl:w-56">
            <Search className="w-3.5 h-3.5 text-[#8A919D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#FAFAFA] hover:bg-[#F7F8FA] focus:bg-[#FFFFFF] border border-[#E5E7EB] rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-[#0B0F19] placeholder:text-[#8A919D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A919D] hover:text-[#0B0F19] p-0.5 rounded cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Add Purchase Button */}
          <button
            id="header-add-purchase-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer hover:shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Purchase</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="header-notification-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] flex items-center justify-center text-[#5F6673] hover:text-[#0B0F19] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#0B0F19] text-xs">Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] font-semibold">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-[#2563EB] hover:text-[#1D4ED8] font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E5E7EB] mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#8A919D]">No notifications</div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`py-2.5 px-2 rounded-lg transition-colors cursor-pointer flex items-start gap-2.5 ${
                          !notif.read ? "bg-[#EFF6FF]" : "hover:bg-[#F7F8FA]"
                        }`}
                      >
                        <div className="mt-0.5">
                          {notif.urgency === "urgent" ? (
                            <div className="w-5 h-5 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                              <AlertTriangle className="w-3 h-3" />
                            </div>
                          ) : notif.urgency === "warning" ? (
                            <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                              <Clock className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-semibold text-[#0B0F19] truncate">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5F6673] mt-0.5 leading-snug">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#E5E7EB] text-center">
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      setActiveTab("notifications");
                    }}
                    className="text-xs text-[#2563EB] font-semibold hover:text-[#1D4ED8] inline-flex items-center gap-1 cursor-pointer"
                  >
                    View All Notifications <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] transition-colors cursor-pointer"
              title="User Account"
            >
              <div className="w-6 h-6 rounded-full bg-[#0B0F19] text-white text-[10px] font-bold flex items-center justify-center">
                {userInitials}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-[#E5E7EB]">
                  <p className="text-xs font-bold text-[#0B0F19] truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-[#5F6673] truncate">{currentUser?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                    <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                    {currentUser?.plan || "Pro Shopper"}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#0B0F19] hover:bg-[#F7F8FA] rounded-lg transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#5F6673]" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateToLanding();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#0B0F19] hover:bg-[#F7F8FA] rounded-lg transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-[#5F6673]" />
                    <span>Landing Page</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#DC2626] hover:bg-[#FEE2E2]/60 rounded-lg transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-[#E5E7EB] pt-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#8A919D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search purchases, invoices, serials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#FAFAFA] border border-[#E5E7EB] rounded-full text-[#0B0F19] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A919D]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
