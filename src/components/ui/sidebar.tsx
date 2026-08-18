import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Links {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen sticky top-0 px-3.5 py-4 hidden md:flex md:flex-col bg-[#FFFFFF] border-r border-[#E5E7EB] w-[260px] flex-shrink-0 z-30 select-none shadow-none",
        className
      )}
      animate={{
        width: animate ? (open ? "260px" : "72px") : "260px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-3 flex flex-row md:hidden items-center justify-between bg-[#FFFFFF] border-b border-[#E5E7EB] w-full z-40 sticky top-0"
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#0B0F19] flex items-center justify-center text-white font-bold text-xs">
            BW
          </div>
          <span className="font-bold text-[#0B0F19] text-sm">BuyWise AI</span>
        </div>
        <div className="flex justify-end z-20">
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-[8px] text-[#5F6673] hover:bg-[#F7F8FA] hover:text-[#0B0F19] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-4/5 max-w-sm inset-0 bg-[#FFFFFF] p-6 z-[100] flex flex-col justify-between shadow-xl border-r border-[#E5E7EB] overflow-y-auto",
                className
              )}
            >
              <div
                className="absolute right-5 top-5 z-50 text-[#8A919D] hover:text-[#0B0F19] cursor-pointer p-1 rounded-[8px] hover:bg-[#F7F8FA] transition-colors"
                onClick={() => setOpen(!open)}
              >
                <X className="w-5 h-5" />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { open, animate } = useSidebar();
  const isActive = link.isActive;

  const handleClick = (e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex items-center justify-start gap-3 group/sidebar py-2 px-2.5 rounded-[10px] transition-colors duration-150 text-left relative cursor-pointer",
        isActive
          ? "bg-[#2563EB] text-white font-semibold shadow-xs"
          : "text-[#5F6673] hover:bg-[#F7F8FA] hover:text-[#0B0F19]",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 flex items-center justify-center">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-[13px] transition duration-150 whitespace-pre inline-block !p-0 !m-0 font-medium truncate flex-1",
          isActive ? "text-white font-semibold" : "text-[#0B0F19]"
        )}
      >
        {link.label}
      </motion.span>
      {link.badge && (
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="ml-auto"
        >
          {link.badge}
        </motion.span>
      )}
    </button>
  );
};
