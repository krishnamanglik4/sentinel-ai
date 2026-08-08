import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, User, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isPublicPage = ['/', '/about', '/login', '/register'].includes(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#080c14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-[#080c14] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              SENTINEL<span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Cybersecurity Platform</span>
          </div>
        </Link>

        {/* Public Nav Links */}
        {isPublicPage && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/" className={`hover:text-cyan-400 transition-colors ${location.pathname === '/' ? 'text-cyan-400 font-semibold' : ''}`}>
              Home
            </Link>
            <Link to="/about" className={`hover:text-cyan-400 transition-colors ${location.pathname === '/about' ? 'text-cyan-400 font-semibold' : ''}`}>
              How It Works
            </Link>
            {isAuthenticated && (
              <Link to="/app/dashboard" className="hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/app/dashboard"
                className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {user?.full_name || 'Dashboard'}
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/app/dashboard"
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow-cyan"
              >
                <span>Start Scanning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
