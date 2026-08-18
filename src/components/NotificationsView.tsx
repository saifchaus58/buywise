import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Trash2,
  CheckCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDisplayDate } from "../types";

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveTab } = useApp();

  return (
    <div id="notifications-view" className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automated alerts for return window cutoffs, expiring warranties, and savings
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-semibold shadow-2xs transition-all self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                !n.read ? "bg-indigo-50/40 rounded-2xl" : "hover:bg-slate-50 rounded-2xl"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {n.urgency === "urgent" ? (
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : n.urgency === "warning" ? (
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                  ) : n.urgency === "success" ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.read && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                {new Date(n.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
