import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Shield, Eye, Cpu, FileText, Globe, Mic, Video } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
            TECHNICAL ARCHITECTURE & FORENSICS
          </div>
          <h1 className="text-4xl font-extrabold font-outfit text-white tracking-tight">
            How Sentinel AI Works
          </h1>
          <p className="mt-4 text-slate-400 text-base max-w-2xl mx-auto">
            A multi-modal cybersecurity defense platform combining computer vision, NLP, digital signal processing, and threat intelligence.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="glass-panel p-8 rounded-2xl border-slate-800">
            <div className="flex items-center gap-3 text-cyan-400 font-bold font-outfit text-xl mb-4">
              <Eye className="w-6 h-6" />
              <span>1. Image & Document Forensics Engine</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              When an image or PDF document is uploaded, Sentinel AI automatically classifies whether it represents a standard photograph or a document.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li><strong className="text-slate-200">Error Level Analysis (ELA):</strong> Re-compresses the image at 95% JPEG quality and analyzes compression error variance across grids to highlight local edits.</li>
              <li><strong className="text-slate-200">Noise Discontinuity:</strong> Measures Laplacian variance across pixel regions to find unnatural smoothing or edge blending.</li>
              <li><strong className="text-slate-200">Metadata Parsing:</strong> Reads EXIF tags for photo editing software signatures (Photoshop, GIMP, Canva).</li>
              <li><strong className="text-slate-200">Suspicious Region Bounding Boxes:</strong> Highlights exact coordinate bounding boxes around tampered numbers or text fields.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="glass-panel p-8 rounded-2xl border-slate-800">
            <div className="flex items-center gap-3 text-cyan-400 font-bold font-outfit text-xl mb-4">
              <Globe className="w-6 h-6" />
              <span>2. URL Phishing & Threat Intelligence</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Parses domain hierarchy, protocol security, subdomains, IP usage, and top-level domain extensions (.xyz, .top, .work).
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li>Identifies brand typosquatting (e.g. paypa1.com, google-verify.xyz).</li>
              <li>Flags direct numerical IP references concealing real hostnames.</li>
              <li>Checks for suspicious URL path obfuscation characters (@, hyphens).</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="glass-panel p-8 rounded-2xl border-slate-800">
            <div className="flex items-center gap-3 text-cyan-400 font-bold font-outfit text-xl mb-4">
              <FileText className="w-6 h-6" />
              <span>3. Scam & Social Engineering Message Analysis</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Uses TF-IDF n-gram tokenization and Logistic Regression ML models to detect high-pressure psychological triggers in SMS, WhatsApp, and Emails.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li>Detects artificial urgency (account suspended within 2 hours).</li>
              <li>Identifies direct requests for OTPs, 6-digit verification codes, and passwords.</li>
              <li>Flags financial lures (lottery rewards, customs fee demands).</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="glass-panel p-8 rounded-2xl border-slate-800">
            <div className="flex items-center gap-3 text-cyan-400 font-bold font-outfit text-xl mb-4">
              <Mic className="w-6 h-6" />
              <span>4. Audio & Synthetic Voice Clone Scanner</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Deconstructs audio recordings into Mel-Frequency Cepstral Coefficients (MFCCs), spectral roll-off, pitch tracking, and zero-crossing rates.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li>Generates Mel-Spectrogram plots highlighting neural vocoder filter artifacts.</li>
              <li>Evaluates fundamental frequency (f0) pitch std deviation to spot robotic monotone voice clones.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="glass-panel p-8 rounded-2xl border-slate-800">
            <div className="flex items-center gap-3 text-cyan-400 font-bold font-outfit text-xl mb-4">
              <Video className="w-6 h-6" />
              <span>5. Video Deepfake Analyzer</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Samples frames at 0.5s intervals, applies OpenCV face detection, and measures facial ROI texture variance and inter-frame temporal consistency.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li>Renders thumbnail grid of keyframes with individual frame risk scores.</li>
              <li>Aggregates frame predictions into an overall deepfake likelihood metric.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#060910] py-6 text-xs text-slate-500 text-center">
        © 2026 Sentinel AI. Built for SIH Hackathon & Production Cybersecurity.
      </footer>
    </div>
  );
};
