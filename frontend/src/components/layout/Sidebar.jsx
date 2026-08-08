import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  History, 
  Settings,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
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
    <aside className="w-64 border-r border-slate-800 bg-[#080c14] flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
          DETECTION MODULES
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border border-cyan-500/30 text-cyan-400 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 text-cyan-500" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-4">
        <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-violet-950/30 p-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>AI Risk Engine v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Multi-modal forensic signals normalized into instant trust scores.
          </p>
        </div>
      </div>
    </aside>
  );
};
