import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Globe, MessageSquare, Image as ImageIcon, Video, Mic, History, Settings, Shield } from 'lucide-react';

export const MobileDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Overview', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'URL Scanner', path: '/app/scanner/url', icon: Globe },
    { label: 'Message Scanner', path: '/app/scanner/message', icon: MessageSquare },
    { label: 'Image Scanner', path: '/app/scanner/image', icon: ImageIcon },
    { label: 'Video Scanner', path: '/app/scanner/video', icon: Video },
    { label: 'Audio Scanner', path: '/app/scanner/audio', icon: Mic },
    { label: 'Scan History', path: '/app/history', icon: History },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-72 bg-[#080c14] border-r border-slate-800 p-4 flex flex-col justify-between z-10 shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-outfit font-extrabold text-lg text-white">SENTINEL AI</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              NAVIGATION
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 text-center">
          Sentinel AI v1.0 • Multi-Modal Detection
        </div>
      </div>
    </div>
  );
};
