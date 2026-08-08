import React from 'react';
import { Settings as SettingsIcon, User, Key, Shield, Bell, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          <span>Platform Settings & Account Preferences</span>
        </h1>
        <p className="text-xs text-slate-400">Configure security threshold preferences and profile parameters</p>
      </div>

      {/* Account Info */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <h2 className="text-base font-bold font-outfit text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-cyan-400" />
          <span>User Profile</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-medium text-white">{user?.full_name || 'Security Analyst'}</div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-medium text-white">{user?.email || 'analyst@sentinel.ai'}</div>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <h2 className="text-base font-bold font-outfit text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>Developer API Integration Key</span>
        </h2>
        <p className="text-xs text-slate-400">Use this secret key to authenticate programmatic API calls to Sentinel AI backend endpoints.</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            readOnly
            value="st_live_99f829374bd82937102938475a8e9f"
            className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-cyan-400"
          />
          <button
            onClick={() => alert("API Key copied to clipboard!")}
            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white"
          >
            Copy Key
          </button>
        </div>
      </div>

      {/* Detection Engine Parameters */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <h2 className="text-base font-bold font-outfit text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Risk Engine Threshold Configuration</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div>
              <div className="font-semibold text-white">Strict Phishing Detection</div>
              <div className="text-slate-400 text-[11px]">Enforce aggressive keyword matching for newly registered domains</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500 rounded" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div>
              <div className="font-semibold text-white">Error Level Analysis Sensitivity</div>
              <div className="text-slate-400 text-[11px]">Flag low-contrast JPEG compression error deltas</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
