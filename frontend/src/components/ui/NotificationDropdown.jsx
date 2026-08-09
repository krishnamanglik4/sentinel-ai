import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', title: 'Phishing Domain Detected', time: '2m ago', desc: 'http://verify-bank-security.xyz was flagged as CRITICAL.' },
    { id: 2, type: 'warning', title: 'Tampered Document Scan', time: '15m ago', desc: 'ELA anomaly detected around text field #1.' },
    { id: 3, type: 'safe', title: 'System Security Health', time: '1h ago', desc: 'All 5 forensic engines operating at optimal latency.' },
  ]);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        title="Alert Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-panel p-4 rounded-2xl border-slate-700 shadow-2xl z-50 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-outfit font-bold text-sm text-white flex items-center gap-1.5">
              <span>Security Notifications</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono">
                {unreadCount}
              </span>
            </span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-0.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className={n.type === 'critical' ? 'text-red-400' : n.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'}>
                    {n.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{n.time}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
