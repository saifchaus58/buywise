import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Purchase,
  NotificationItem,
  ActiveTab,
  ExtractedReceiptData,
  UserProfile,
  AppView,
  AuthMode,
  getReturnStatus,
  getWarrantyStatus,
} from "../types";
import { INITIAL_PURCHASES, INITIAL_NOTIFICATIONS } from "../data/initialData";
import { supabase } from "../supabaseClient";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error" | "warning";
}

export const DEFAULT_USER: UserProfile = {
  id: "user-demo-1",
  name: "Usama Boat",
  email: "usama.boat@gmail.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  plan: "Pro Shopper",
  joinedDate: "July 2026",
  isPro: true,
};

interface AppContextType {
  purchases: Purchase[];
  notifications: NotificationItem[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  navigateToApp: () => void;
  navigateToLanding: () => void;
  // Auth state
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  login: (email: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<boolean>;
  loginWithSocial: (provider: "google" | "apple" | "github") => Promise<boolean>;
  logout: () => void;
  demoLogin: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  selectedPurchase: Purchase | null;
  setSelectedPurchase: (purchase: Purchase | null) => void;
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "info" | "error" | "warning") => void;
  removeToast: (id: string) => void;
  addPurchase: (data: ExtractedReceiptData, receiptImage?: string) => Purchase;
  updatePurchase: (purchase: Purchase) => void;
  deletePurchase: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
  unreadNotificationsCount: number;
  stats: {
    totalPurchasesCount: number;
    totalSpent: number;
    activeWarrantiesCount: number;
    expiringSoonCount: number;
    urgentReturnsCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PURCHASES_KEY = "buywise_purchases_v1";
const STORAGE_NOTIFS_KEY = "buywise_notifications_v1";
const STORAGE_USER_KEY = "buywise_user_v1";
const STORAGE_VIEW_KEY = "buywise_view_v1";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
      return null; // By default unauthenticated until verified with Supabase getSession
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VIEW_KEY);
      if (saved === "landing" || saved === "app") return saved;
      return "landing";
    } catch {
      return "landing";
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  // Protect private pages with supabase.auth.getSession()
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Error getting Supabase session:", error.message);
        }

        const session = data?.session;
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const userProfile: UserProfile = {
            id: session.user.id,
            name:
              userMeta.full_name ||
              userMeta.name ||
              session.user.email?.split("@")[0] ||
              "Verified User",
            email: session.user.email || "",
            plan: "Pro Shopper",
            joinedDate: new Date(session.user.created_at || Date.now()).toLocaleDateString(
              "en-US",
              { month: "short", year: "numeric" }
            ),
            isPro: true,
          };
          setCurrentUser(userProfile);
        } else {
          // If on private page / app view without an authenticated session, redirect to /login
          const savedUser = localStorage.getItem(STORAGE_USER_KEY);
          if (!savedUser) {
            setCurrentUser(null);
            setCurrentView("landing");
            if (window.location.pathname === "/app" || window.location.pathname === "/dashboard") {
              window.history.pushState({}, "", "/login");
              setIsAuthModalOpen(true);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to check Supabase session:", err);
      }
    };

    initializeAuth();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const userProfile: UserProfile = {
            id: session.user.id,
            name:
              userMeta.full_name ||
              userMeta.name ||
              session.user.email?.split("@")[0] ||
              "Verified User",
            email: session.user.email || "",
            plan: "Pro Shopper",
            joinedDate: new Date(session.user.created_at || Date.now()).toLocaleDateString(
              "en-US",
              { month: "short", year: "numeric" }
            ),
            isPro: true,
          };
          setCurrentUser(userProfile);
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          setCurrentView("landing");
          window.history.pushState({}, "", "/login");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PURCHASES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync user and view
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (e) {
      console.warn("Failed to persist user to localStorage", e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VIEW_KEY, currentView);
    } catch (e) {
      console.warn("Failed to persist view to localStorage", e);
    }
  }, [currentView]);

  const openAuthModal = (mode: AuthMode = "signin") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const navigateToApp = () => {
    setCurrentView("app");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToLanding = () => {
    setCurrentView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const login = async (email: string, name?: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: "user-" + Date.now(),
      name: name || (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)),
      email,
      plan: "Pro Shopper",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      isPro: true,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    setCurrentView("app");
    addToast(`Welcome back, ${newUser.name}!`, "success");
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {}
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: "user-" + Date.now(),
      name,
      email,
      plan: "Free Starter",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      isPro: false,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    setCurrentView("app");
    addToast(`Account created! Welcome to BuyWise AI, ${name}.`, "success");
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {}
    return true;
  };

  const loginWithSocial = async (provider: "google" | "apple" | "github"): Promise<boolean> => {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    const mockUser: UserProfile = {
      id: `user-${provider}-${Date.now()}`,
      name: provider === "google" ? "Alex Rivera" : provider === "apple" ? "Taylor Swift" : "Dev Coder",
      email: `${provider}.user@buywise.ai`,
      plan: "Pro Shopper",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      isPro: true,
    };
    setCurrentUser(mockUser);
    setIsAuthModalOpen(false);
    setCurrentView("app");
    addToast(`Successfully connected via ${providerName}!`, "success");
    try {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
    } catch {}
    return true;
  };

  const demoLogin = () => {
    setCurrentUser(DEFAULT_USER);
    setIsAuthModalOpen(false);
    setCurrentView("app");
    addToast("Logged in with Demo Vault access", "info");
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase sign out error:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    setCurrentView("landing");
    window.history.pushState({}, "", "/");
    addToast("Signed out successfully", "info");
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(purchases));
    } catch (e) {
      console.warn("Failed to persist purchases to localStorage", e);
    }
  }, [purchases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn("Failed to persist notifications to localStorage", e);
    }
  }, [notifications]);

  const addToast = (message: string, type: "success" | "info" | "error" | "warning" = "success") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addPurchase = (data: ExtractedReceiptData, receiptImage?: string): Purchase => {
    const newPurchase: Purchase = {
      id: "pur-" + Date.now(),
      product: data.product,
      seller: data.seller,
      category: data.category,
      invoiceNumber: data.invoiceNumber,
      purchaseDate: data.purchaseDate,
      amount: Number(data.amount) || 0,
      gst: Number(data.gst) || 0,
      warrantyMonths: Number(data.warrantyMonths) || 12,
      returnDays: Number(data.returnDays) || 7,
      confidence: Number(data.confidence) || 96,
      receiptImage: receiptImage || undefined,
      notes: `${data.product} purchased from ${data.seller}. Invoice #${data.invoiceNumber}`,
      aiInsight: data.aiInsight || "This purchase has been logged with automatic deadline calculations.",
      createdAt: new Date().toISOString(),
    };

    setPurchases((prev) => [newPurchase, ...prev]);

    // Add positive notification
    const newNotif: NotificationItem = {
      id: "notif-" + Date.now(),
      type: "purchase",
      title: "Purchase Added",
      message: `${newPurchase.product} successfully added and deadlines calculated.`,
      purchaseId: newPurchase.id,
      productName: newPurchase.product,
      urgency: "success",
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#6366f1", "#8b5cf6", "#3b82f6", "#10b981"],
      });
    } catch {
      // ignore
    }

    addToast(`✓ ${newPurchase.product} added successfully`, "success");
    return newPurchase;
  };

  const updatePurchase = (updated: Purchase) => {
    setPurchases((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast(`Purchase "${updated.product}" updated`, "info");
  };

  const deletePurchase = (id: string) => {
    const found = purchases.find((p) => p.id === id);
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    if (found) {
      addToast(`Removed "${found.product}"`, "info");
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read", "info");
  };

  const resetToDemoData = () => {
    setPurchases(INITIAL_PURCHASES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_PURCHASES_KEY);
    localStorage.removeItem(STORAGE_NOTIFS_KEY);
    addToast("Reset to pristine Hackathon demo dataset", "info");
  };

  // Computed stats
  const totalPurchasesCount = purchases.length;
  const totalSpent = purchases.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  let activeWarrantiesCount = 0;
  let expiringSoonCount = 0;
  let urgentReturnsCount = 0;

  purchases.forEach((p) => {
    const warrantyInfo = getWarrantyStatus(p.purchaseDate, p.warrantyMonths);
    if (warrantyInfo.status === "active" || warrantyInfo.status === "expiring_soon") {
      activeWarrantiesCount++;
    }
    if (warrantyInfo.status === "expiring_soon") {
      expiringSoonCount++;
    }

    const returnInfo = getReturnStatus(p.purchaseDate, p.returnDays);
    if (returnInfo.status === "expiring_soon") {
      urgentReturnsCount++;
    }
  });

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        purchases,
        notifications,
        activeTab,
        setActiveTab,
        currentView,
        setCurrentView,
        navigateToApp,
        navigateToLanding,
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginWithSocial,
        logout,
        demoLogin,
        searchQuery,
        setSearchQuery,
        isAddModalOpen,
        setIsAddModalOpen,
        selectedPurchase,
        setSelectedPurchase,
        toasts,
        addToast,
        removeToast,
        addPurchase,
        updatePurchase,
        deletePurchase,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
        unreadNotificationsCount,
        stats: {
          totalPurchasesCount,
          totalSpent,
          activeWarrantiesCount,
          expiringSoonCount,
          urgentReturnsCount,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
