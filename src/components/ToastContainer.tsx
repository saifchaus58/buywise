import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-slate-900 text-white border-slate-800"
              : toast.type === "error"
              ? "bg-rose-900 text-white border-rose-800"
              : "bg-white text-slate-900 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-indigo-500 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
