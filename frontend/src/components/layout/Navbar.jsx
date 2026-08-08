import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Search, User, LogOut, ArrowRight, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { MobileDrawer } from './MobileDrawer';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isPublicPage = ['/', '/about', '/login', '/register'].includes(location.pathname);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/history?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#080c14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            {!isPublicPage && (
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-glow-cyan">
                <div className="w-full h-full bg-[#080c14] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <Shield className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                  SENTINEL<span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[9px] tracking-widest text-slate-400 uppercase font-mono hidden sm:inline">Cybersecurity Platform</span>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Bar (on app pages) */}
          {!isPublicPage && (
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-xs relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scans, threats, URLs..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </form>
          )}

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

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {!isPublicPage && <NotificationDropdown />}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/app/settings"
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{user?.full_name || 'Account'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-slate-800"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-300 hover:text-white px-2 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/app/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:shadow-glow-cyan transition-all"
                >
                  <span>Start Scanning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
