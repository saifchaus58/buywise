/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { PurchasesView } from "./components/PurchasesView";
import { WarrantiesView } from "./components/WarrantiesView";
import { ReturnsView } from "./components/ReturnsView";
import { BillsReceiptsView } from "./components/BillsReceiptsView";
import { SpendingInsightsView } from "./components/SpendingInsightsView";
import { AIAssistantView } from "./components/AIAssistantView";
import { NotificationsView } from "./components/NotificationsView";
import { SettingsView } from "./components/SettingsView";
import { AddPurchaseModal } from "./components/AddPurchaseModal";
import { ReceiptDetailModal } from "./components/ReceiptDetailModal";
import { ToastContainer } from "./components/ToastContainer";
import { LandingPageView } from "./components/LandingPageView";
import { AuthModal } from "./components/AuthModal";

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0B0F19] antialiased selection:bg-[#2563EB] selection:text-white">
      {/* Top Header with Apple-Style Navigation Dock */}
      <Header />

      {/* Main Content Area - Full Width Clean Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto animate-in fade-in duration-200">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "purchases" && <PurchasesView />}
        {activeTab === "warranties" && <WarrantiesView />}
        {activeTab === "returns" && <ReturnsView />}
        {activeTab === "bills" && <BillsReceiptsView />}
        {activeTab === "insights" && <SpendingInsightsView />}
        {activeTab === "assistant" && <AIAssistantView />}
        {activeTab === "notifications" && <NotificationsView />}
        {activeTab === "settings" && <SettingsView />}
      </main>

      {/* Global Modals & Toasts */}
      <AddPurchaseModal />
      <ReceiptDetailModal />
      <ToastContainer />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentView, currentUser, openAuthModal, setCurrentView } = useApp();

  // Route protection: If user tries to access the private app dashboard without a session, redirect to /login
  React.useEffect(() => {
    if (currentView === "app" && !currentUser) {
      window.history.pushState({}, "", "/login");
      setCurrentView("landing");
      openAuthModal("signin");
    }
  }, [currentView, currentUser, openAuthModal, setCurrentView]);

  return (
    <>
      {currentView === "app" && currentUser ? <MainLayout /> : <LandingPageView />}
      <AuthModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
