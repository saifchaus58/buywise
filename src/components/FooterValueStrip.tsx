import React from "react";
import { Sparkles, BellRing, Lock, CheckCircle } from "lucide-react";

export const FooterValueStrip: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: "AI-Powered Extraction",
      description: "Extract data from bills & receipts",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      icon: BellRing,
      title: "Smart Reminders",
      description: "Never miss a warranty or return",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your purchase data stays protected",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      icon: CheckCircle,
      title: "One Place, All Clear",
      description: "Track, manage & save smarter",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div
      id="footer-value-strip"
      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs mt-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
