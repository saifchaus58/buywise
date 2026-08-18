import React, { useState } from "react";
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
  Sparkles,
  Zap,
  Shield,
  Home,
  LogOut,
  LogIn,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ActiveTab } from "../types";
import {
  Sidebar as AceternitySidebar,
  SidebarBody,
  SidebarLink,
} from "./ui/sidebar";
import { motion } from "motion/react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
    stats,
    currentUser,
    logout,
    openAuthModal,
    navigateToLanding,
  } = useApp();
  const [open, setOpen] = useState(false);

  const effectiveOpen = isMobileOpen !== undefined ? (isMobileOpen || open) : open;

  const handleSetOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    if (typeof value === "function") {
      setOpen((prev) => {
        const next = value(prev);
        if (!next && onCloseMobile) onCloseMobile();
        return next;
      });
    } else {
      setOpen(value);
      if (!value && onCloseMobile) onCloseMobile();
    }
  };

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />,
    },
    {
      id: "purchases",
      label: "Purchases",
      icon: <ShoppingBag className="w-4 h-4 flex-shrink-0" />,
      badge: stats.totalPurchasesCount,
      badgeColor: "bg-[#F3F4F6] text-[#0B0F19]",
    },
    {
      id: "warranties",
      label: "Warranties",
      icon: <ShieldCheck className="w-4 h-4 flex-shrink-0" />,
      badge: stats.expiringSoonCount > 0 ? `${stats.expiringSoonCount} soon` : undefined,
      badgeColor: "bg-[#FEF3C7] text-[#92400E] font-medium",
    },
    {
      id: "bills",
      label: "Bills & Receipts",
      icon: <ReceiptText className="w-4 h-4 flex-shrink-0" />,
    },
    {
      id: "returns",
      label: "Returns & Refunds",
      icon: <RotateCcw className="w-4 h-4 flex-shrink-0" />,
      badge: stats.urgentReturnsCount > 0 ? `${stats.urgentReturnsCount} urgent` : undefined,
      badgeColor: "bg-[#FEE2E2] text-[#991B1B] font-bold",
    },
    {
      id: "insights",
      label: "Spending Insights",
      icon: <PieChart className="w-4 h-4 flex-shrink-0" />,
    },
    {
      id: "assistant",
      label: "AI Assistant",
      icon: <Bot className="w-4 h-4 flex-shrink-0" />,
      badge: "AI",
      badgeColor: "bg-[#EFF6FF] text-[#1E40AF] font-bold",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4 flex-shrink-0" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: "bg-[#EF4444] text-white font-bold",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4 flex-shrink-0" />,
    },
  ];

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BW";

  return (
    <AceternitySidebar open={effectiveOpen} setOpen={handleSetOpen} animate={true}>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          {/* Logo Header */}
          <div
            className="flex items-center gap-3 py-1 relative z-20 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="w-8 h-8 rounded-[8px] bg-[#0B0F19] flex items-center justify-center text-white flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <motion.div
              animate={{
                display: effectiveOpen ? "flex" : "none",
                opacity: effectiveOpen ? 1 : 0,
              }}
              className="flex flex-col whitespace-pre"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#0B0F19] text-[15px] tracking-tight">BuyWise</span>
                <span className="text-[10px] font-bold text-[#2563EB]">AI</span>
              </div>
              <p className="text-[11px] text-[#8A919D] font-medium">Warranty Vault</p>
            </motion.div>
          </div>

          {/* Landing Page Quick Switch Link */}
          <div className="mt-4 pt-2 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={navigateToLanding}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[12px] font-medium text-[#5F6673] hover:text-[#0B0F19] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              <motion.span
                animate={{
                  display: effectiveOpen ? "inline-block" : "none",
                  opacity: effectiveOpen ? 1 : 0,
                }}
                className="truncate"
              >
                Landing Page
              </motion.span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <SidebarLink
                  key={item.id}
                  link={{
                    label: item.label,
                    icon: item.icon,
                    isActive,
                    onClick: () => {
                      setActiveTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    },
                    badge:
                      item.badge !== undefined ? (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white font-bold"
                              : item.badgeColor || "bg-[#F3F4F6] text-[#5F6673]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-3 pt-3 border-t border-[#E5E7EB]">
          {/* User Profile */}
          {currentUser ? (
            <div className="flex items-center justify-between p-1.5 rounded-[10px] hover:bg-[#F7F8FA] transition-colors">
              <div
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                onClick={() => setActiveTab("settings")}
              >
                <div className="w-8 h-8 rounded-[8px] bg-[#0B0F19] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                  {userInitials}
                </div>
                <motion.div
                  animate={{
                    display: effectiveOpen ? "flex" : "none",
                    opacity: effectiveOpen ? 1 : 0,
                  }}
                  className="flex flex-col text-left leading-tight whitespace-pre overflow-hidden"
                >
                  <span className="text-[13px] font-semibold text-[#0B0F19] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    {currentUser.plan}
                  </span>
                </motion.div>
              </div>

              <motion.button
                animate={{
                  display: effectiveOpen ? "block" : "none",
                  opacity: effectiveOpen ? 1 : 0,
                }}
                onClick={logout}
                className="p-1.5 text-[#8A919D] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-[6px] transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("signin")}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-[8px] bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <motion.span
                animate={{
                  display: effectiveOpen ? "inline-block" : "none",
                  opacity: effectiveOpen ? 1 : 0,
                }}
              >
                Sign In / Sign Up
              </motion.span>
            </button>
          )}
        </div>
      </SidebarBody>
    </AceternitySidebar>
  );
};
