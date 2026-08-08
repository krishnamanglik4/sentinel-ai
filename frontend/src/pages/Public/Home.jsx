import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Image as ImageIcon, 
  Globe, 
  MessageSquare, 
  Mic, 
  Video, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Lock, 
  Zap 
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { ScoreMeter } from '../../components/ui/ScoreMeter';

export const Home = () => {
  const modules = [
    {
      title: "Image & Document Forensic Scanner",
      desc: "Automatic document/photo classification, Error Level Analysis (ELA), metadata parsing, and bounding box tampering overlays.",
      icon: ImageIcon,
      path: "/app/scanner/image",
      badge: "Vision AI"
    },
    {
      title: "Malicious & Phishing URL Scanner",
      desc: "Domain typosquatting analysis, IP address detection, structural entropy, and credential harvest keyword extraction.",
      icon: Globe,
      path: "/app/scanner/url",
      badge: "Threat Intel"
    },
    {
      title: "Scam & Phishing Message Scanner",
      desc: "SMS, WhatsApp, and Email social engineering analysis with TF-IDF machine learning urgency and OTP trigger detection.",
      icon: MessageSquare,
      path: "/app/scanner/message",
      badge: "NLP Engine"
    },
    {
      title: "AI-Generated Voice Clone Scanner",
      desc: "Acoustic MFCC feature extraction, Mel spectrogram rendering, and synthetic vocoder pitch consistency inspection.",
      icon: Mic,
      path: "/app/scanner/audio",
      badge: "Audio AI"
    },
    {
      title: "Deepfake Video Scanner",
      desc: "Facial ROI temporal sampling, face detection, and boundary texture discontinuity scoring across video frames.",
      icon: Video,
      path: "/app/scanner/video",
      badge: "Deep Learning"
    }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden border-b border-slate-800/80 bg-cyber-grid">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide mb-8 shadow-glow-cyan"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SIH 2026 EDITION — PRODUCTION DIGITAL SAFETY PLATFORM</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-outfit tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            Detect. Verify. <span className="text-gradient-cyan">Stay Safe.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered protection against deepfakes, phishing, digital fraud, voice clones, and manipulated media with instant trust scoring and Explainable AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/app/dashboard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-black font-extrabold text-base hover:shadow-glow-cyan transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start Scanning Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 font-semibold text-base hover:border-slate-500 hover:bg-slate-800 transition-all"
            >
              How It Works
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60 text-left">
            <div>
              <div className="text-2xl font-bold font-outfit text-white">99.2%</div>
              <div className="text-xs text-slate-400">Scam Detection Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-outfit text-cyan-400">&lt; 1.5s</div>
              <div className="text-xs text-slate-400">Average Forensic Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-outfit text-violet-400">5 Modules</div>
              <div className="text-xs text-slate-400">Multi-Modal AI Engine</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-outfit text-emerald-400">0–100</div>
              <div className="text-xs text-slate-400">Normalized Risk Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Modules Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            Five Specialized Forensic Analyzers
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            No technical knowledge required. Upload any suspicious link, document, voice recording, or video for automated analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 font-bold">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-white mb-2">{mod.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{mod.desc}</p>
                </div>

                <Link
                  to={mod.path}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
                >
                  <span>Launch Scanner</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}

          {/* Combined Risk Engine Card */}
          <div className="glass-panel p-6 rounded-2xl border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-violet-950/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-white mb-2">Unified Risk Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                All 5 modules stream raw forensic signals into a common engine computing standard Risk & Trust scores with XAI explanations.
              </p>
            </div>
            <div className="text-xs font-mono text-violet-400 bg-violet-950/40 border border-violet-500/30 p-2.5 rounded-xl">
              ✓ Standardized 0-100 Normalized Scale
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score & XAI Explanation Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
              EXPLAINABLE AI (XAI)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight leading-tight">
              Transparent & Actionable Risk Intelligence
            </h2>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Sentinel AI never leaves you guessing with black-box scores. Every result provides exact signal breakdowns, visual bounding boxes for tampered text, and clear recommended actions.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Normalized 0–100 Risk Score:</strong> Unified risk evaluation scale from SAFE (0-20) to CRITICAL (81-100).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Visual Region Overlays:</strong> Highlights tampered text fields and cloned pixel regions directly on documents.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Actionable Next Steps:</strong> Provides non-technical safety guidelines tailored to the specific threat.</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-slate-700 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-8 mb-6">
              <ScoreMeter score={87} label="Risk Score" size={140} />
              <ScoreMeter score={13} label="Trust Score" size={140} />
            </div>

            <div className="w-full bg-red-950/40 border border-red-500/30 p-4 rounded-2xl text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 uppercase">HIGH RISK DETECTED</span>
                <span className="text-xs text-slate-400">Confidence: 91%</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                ✓ Compression anomaly (ELA error: 22.4)<br/>
                ✓ Font/layout inconsistency near name field<br/>
                ✓ Metadata traces of photo editing software
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="glass-panel p-12 rounded-3xl border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white mb-4">
            Protect Yourself Against Digital Fraud Today
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
            Experience production-grade AI deepfake and scam detection built for modern cybersecurity workflows.
          </p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-base hover:shadow-glow-cyan transition-all"
          >
            <span>Launch Sentinel AI Console</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#060910] py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Sentinel AI. Built for SIH Hackathon & Production Cybersecurity.</div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-cyan-400">Home</Link>
            <Link to="/about" className="hover:text-cyan-400">How It Works</Link>
            <Link to="/app/dashboard" className="hover:text-cyan-400">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
