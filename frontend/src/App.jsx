import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import { Home } from './pages/Public/Home';
import { About } from './pages/Public/About';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/App/Dashboard';
import { ImageScanner } from './pages/App/ImageScanner';
import { UrlScanner } from './pages/App/UrlScanner';
import { MessageScanner } from './pages/App/MessageScanner';
import { AudioScanner } from './pages/App/AudioScanner';
import { VideoScanner } from './pages/App/VideoScanner';
import { ScanHistory } from './pages/App/ScanHistory';
import { ScanDetails } from './pages/App/ScanDetails';
import { Settings } from './pages/App/Settings';

const AppRouteWrapper = ({ children }) => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-cyan-400 font-mono text-sm">
        Initializing Sentinel Console...
      </div>
    );
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Landing & Auth Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Direct-Access App Console Routes */}
      <Route
        path="/app"
        element={
          <AppRouteWrapper>
            <AppLayout />
          </AppRouteWrapper>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scanner/image" element={<ImageScanner />} />
        <Route path="scanner/url" element={<UrlScanner />} />
        <Route path="scanner/message" element={<MessageScanner />} />
        <Route path="scanner/audio" element={<AudioScanner />} />
        <Route path="scanner/video" element={<VideoScanner />} />
        <Route path="history" element={<ScanHistory />} />
        <Route path="scans/:scanId" element={<ScanDetails />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
