import React from "react";
import {
  Settings,
  User,
  Shield,
  Bot,
  Database,
  RotateCcw,
  Download,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const SettingsView: React.FC = () => {
  const { resetToDemoData, purchases, notifications } = useApp();

  const handleExportJSON = () => {
    const data = {
      purchases,
      notifications,
      exportedAt: new Date().toISOString(),
      app: "BuyWise AI",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BuyWise_Backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Settings & Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your AI preferences, storage, and demo testing dataset
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
            UB
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Usama Boat</h3>
            <p className="text-xs text-slate-500 font-medium">usama244@gmail.com</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pro Plan Active
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Unlimited Receipt OCR</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Engine Status */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">AI Intelligence Engine</h3>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Gemini 3.7 Flash Vision & Multimodal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Server-side prompt engineering with structured JSON schema outputs & OCR grounding
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
            Connected
          </span>
        </div>
      </div>

      {/* Hackathon Demo Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Hackathon Presentation Utilities</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
          <div>
            <h4 className="text-xs font-bold text-indigo-950">Reset to Pristine Demo Dataset</h4>
            <p className="text-[11px] text-indigo-700 mt-0.5">
              Instantly reloads the 6 sample products (MacBook Air, Sony ANC, Samsung QLED, etc.) for repeat demo presentations.
            </p>
          </div>
          <button
            onClick={resetToDemoData}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Export All Data (JSON)</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Download your entire purchase and warranty portfolio as a standard JSON backup.
            </p>
          </div>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
