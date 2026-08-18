import React from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";
import Login06 from "./ui/login-3";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useApp();

  if (!isAuthModalOpen) return null;

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-sm flex justify-center animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-20"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Login06 Card Component */}
        <Login06 />
      </div>
    </div>
  );
};
