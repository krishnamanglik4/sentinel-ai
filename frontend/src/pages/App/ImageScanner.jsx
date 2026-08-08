import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileText, AlertTriangle, ShieldCheck, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { scanImageApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreMeter } from '../../components/ui/ScoreMeter';
import { SuspiciousCanvas } from '../../components/ui/SuspiciousCanvas';

export const ImageScanner = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' or 'ela'

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await scanImageApi(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Image analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>MODULE 01 — VISION & DOCUMENT FORENSICS</span>
        </div>
        <h1 className="text-2xl font-bold font-outfit text-white">Image & Document Manipulation Scanner</h1>
        <p className="text-xs text-slate-400">
          Upload any image or PDF document. System automatically classifies file type and runs Error Level Analysis (ELA), EXIF metadata parsing, and tampered region bounding box detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleUpload} className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : "Drop Image or Document here"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP, BMP, PDF (Max 50MB)</p>
              </div>
            </div>

            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex justify-center">
                <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded-lg" />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-black font-extrabold text-sm hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Analyzing Media Forensics..." : "Run Forensic Scan"}</span>
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">AUTOMATIC CLASSIFICATION</span>
                  <div className="text-base font-bold font-outfit text-cyan-400 uppercase flex items-center gap-2">
                    {result.metadata_info?.image_type === 'document' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    <span>{result.metadata_info?.image_type === 'document' ? 'Document Image' : 'Normal Image / Photo'}</span>
                  </div>
                </div>
                <RiskBadge level={result.threat_level} size="lg" />
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 gap-4 items-center justify-items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <ScoreMeter score={result.risk_score} label="Risk Score" size={130} />
                <ScoreMeter score={result.trust_score} label="Trust Score" size={130} />
              </div>

              {/* View Tabs */}
              <div className="flex gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('canvas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'canvas' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tampered Region Overlay
                </button>
                {result.metadata_info?.ela_image_path && (
                  <button
                    onClick={() => setActiveTab('ela')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'ela' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Error Level Analysis (ELA)
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'canvas' && (
                <SuspiciousCanvas
                  imageUrl={previewUrl}
                  regions={result.metadata_info?.suspicious_regions || []}
                />
              )}

              {activeTab === 'ela' && result.metadata_info?.ela_image_path && (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex justify-center">
                    <img src={result.metadata_info.ela_image_path} alt="ELA Map" className="max-h-64 object-contain rounded-lg" />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center font-mono">
                    ELA Error Variance: {result.metadata_info.ela_score} | High contrast bright pixels indicate re-compression anomalies.
                  </p>
                </div>
              )}

              {/* Signal Indicators */}
              <div>
                <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3">Forensic Signals Evaluated</h4>
                <div className="space-y-2">
                  {result.signals.map((sig, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                      sig.detected ? 'bg-red-950/20 border-red-500/30 text-slate-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}>
                      {sig.detected ? <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-semibold text-white">{sig.name}</div>
                        <div className="mt-0.5 leading-relaxed">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-200 space-y-1">
                <div className="font-bold text-cyan-400 uppercase tracking-wider font-mono">RECOMMENDED ACTION</div>
                <p className="leading-relaxed">{result.recommended_action}</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border-slate-800 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <ImageIcon className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Upload an image or document on the left to begin forensic analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
