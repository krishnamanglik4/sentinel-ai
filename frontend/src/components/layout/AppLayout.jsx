import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LayoutDashboard, Globe, MessageSquare, Image as ImageIcon, Video, Mic } from 'lucide-react';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Quick Action Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/90 border-t border-slate-800 backdrop-blur-xl px-2 py-2 flex items-center justify-around">
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/app/scanner/image"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image</span>
        </NavLink>
        <NavLink
          to="/app/scanner/url"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Globe className="w-4 h-4" />
          <span>URL</span>
        </NavLink>
        <NavLink
          to="/app/scanner/message"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Message</span>
        </NavLink>
        <NavLink
          to="/app/scanner/audio"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Mic className="w-4 h-4" />
          <span>Audio</span>
        </NavLink>
        <NavLink
          to="/app/scanner/video"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </NavLink>
      </nav>
    </div>
  );
};
