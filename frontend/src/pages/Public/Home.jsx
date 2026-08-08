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
  Zap,
  Activity,
  Layers,
  FileCheck
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { ScoreMeter } from '../../components/ui/ScoreMeter';

export const Home = () => {
  const modules = [
    {
      title: "Image & Document Forensics",
      desc: "Automatic document/photo classification, Error Level Analysis (ELA), EXIF metadata parsing, and tampered text region overlays.",
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
      title: "AI Voice Clone Scanner",
      desc: "Acoustic MFCC feature extraction, Mel-Spectrogram plot rendering, and synthetic vocoder pitch consistency inspection.",
      icon: Mic,
      path: "/app/scanner/audio",
      badge: "Audio AI"
    },
    {
      title: "Deepfake Video Scanner",
      desc: "Facial ROI keyframe sampling, OpenCV face detection, and boundary texture discontinuity scoring across video streams.",
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
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide mb-8 shadow-glow-cyan"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SIH 2026 EDITION — PRODUCTION DIGITAL SAFETY PLATFORM</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-outfit tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            Detect. Verify. <span className="text-gradient-cyan">Stay Safe.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered protection against deepfakes, phishing, digital fraud, voice clones, and manipulated media with instant trust scoring and Explainable AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
              <div className="text-xs text-slate-400">Scam Intent Accuracy</div>
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

      {/* Workflow Diagram Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
            4-Step Forensic Workflow
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">
            How Sentinel AI processes digital media to produce transparent safety intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border-slate-800 relative">
            <div className="text-cyan-400 font-mono font-bold text-xs mb-2">STEP 01</div>
            <h3 className="font-bold font-outfit text-white text-base mb-1">User Input</h3>
            <p className="text-xs text-slate-400">Upload single image, URL, SMS text, audio, or video clip.</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-slate-800 relative">
            <div className="text-cyan-400 font-mono font-bold text-xs mb-2">STEP 02</div>
            <h3 className="font-bold font-outfit text-white text-base mb-1">Feature Extraction</h3>
            <p className="text-xs text-slate-400">Computer vision ELA, MFCC audio envelopes, and TF-IDF NLP.</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-slate-800 relative">
            <div className="text-cyan-400 font-mono font-bold text-xs mb-2">STEP 03</div>
            <h3 className="font-bold font-outfit text-white text-base mb-1">Risk Engine</h3>
            <p className="text-xs text-slate-400">Aggregates signals into normalized 0–100 Risk & Trust Scores.</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-slate-800 relative">
            <div className="text-cyan-400 font-mono font-bold text-xs mb-2">STEP 04</div>
            <h3 className="font-bold font-outfit text-white text-base mb-1">Explainable Result</h3>
            <p className="text-xs text-slate-400">Outputs indicator checklist, region overlays, & safety guidelines.</p>
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
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
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

          {/* Unified Risk Engine Card */}
          <div className="glass-panel p-6 rounded-2xl border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-violet-950/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 shadow-glow-violet">
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
