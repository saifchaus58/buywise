"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
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
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface NavItem {
  id?: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  badge?: number | string;
  badgeColor?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Purchases", icon: ShoppingBag },
  { label: "Warranties", icon: ShieldCheck },
  { label: "Bills & Receipts", icon: ReceiptText },
  { label: "Returns", icon: RotateCcw },
  { label: "Insights", icon: PieChart },
  { label: "AI Assistant", icon: Bot },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
];

const MOBILE_LABEL_WIDTH = 84;

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  items?: NavItem[];
  activeIndex?: number;
  onSelect?: (index: number, item: NavItem) => void;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  items = defaultNavItems,
  activeIndex: controlledIndex,
  onSelect,
}: BottomNavBarProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const handleSelect = (idx: number, item: NavItem) => {
    if (controlledIndex === undefined) {
      setInternalIndex(idx);
    }
    if (onSelect) {
      onSelect(idx, item);
    }
  };

  return (
    <motion.nav
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Navigation Bar"
      className={cn(
        "bg-white/95 border border-[#E5E7EB] rounded-full flex items-center p-1.5 shadow-xs space-x-1 max-w-[95vw] h-[48px] overflow-x-auto scrollbar-none",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-20 w-fit shadow-xl",
        className
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <motion.button
            key={item.label + idx}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "flex items-center gap-0 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors duration-200 relative h-9 min-w-[38px] min-h-[36px] cursor-pointer shrink-0 outline-none select-none",
              isActive
                ? "bg-[#2563EB]/10 text-[#2563EB] font-semibold gap-1.5"
                : "bg-transparent text-[#5F6673] hover:text-[#0B0F19] hover:bg-[#F3F4F6]",
              "focus:outline-none focus-visible:ring-0"
            )}
            onClick={() => handleSelect(idx, item)}
            aria-label={item.label}
            type="button"
          >
            <div className="relative flex items-center justify-center">
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                aria-hidden
                className="transition-colors duration-200 shrink-0"
              />
              {item.badge !== undefined && (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-2 text-[9px] px-1 py-0.2 rounded-full font-bold leading-tight shadow-xs",
                    isActive
                      ? "bg-[#2563EB] text-white"
                      : item.badgeColor || "bg-[#EF4444] text-white"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className="overflow-hidden flex items-center max-w-[96px]"
            >
              <span
                className={cn(
                  "font-semibold text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-tight",
                  isActive ? "text-[#2563EB]" : "opacity-0"
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
