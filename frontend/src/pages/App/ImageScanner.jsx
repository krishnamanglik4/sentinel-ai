import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileText, AlertTriangle, CheckCircle2, Eye, Sparkles, RefreshCw } from 'lucide-react';
import { scanImageApi } from '../../api/scans';
import { AnalysisProgress } from '../../components/ui/AnalysisProgress';
import { AnalysisResultCard } from '../../components/ui/AnalysisResultCard';
import { SuspiciousCanvas } from '../../components/ui/SuspiciousCanvas';

export const ImageScanner = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileMeta, setFileMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' or 'ela'

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setFileMeta({
        name: selected.name,
        sizeMB: (selected.size / (1024 * 1024)).toFixed(2),
        type: selected.type || 'image/jpeg'
      });
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
      setError(err.response?.data?.detail || 'Image forensic scan failed. Please check file type.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
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
          Upload any single image or PDF. Sentinel AI automatically classifies file type, executing ELA, EXIF metadata parsing, and tampered region bounding box detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Progress Column */}
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
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3 shadow-lg">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : "Drop Image or PDF Document"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP, BMP, PDF (Max 50MB)</p>
              </div>
            </div>

            {fileMeta && (
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1 font-mono text-slate-400">
                <div className="flex justify-between"><span className="text-slate-500">File Name:</span><span className="text-slate-200 font-bold truncate max-w-[180px]">{fileMeta.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">File Size:</span><span className="text-slate-200">{fileMeta.sizeMB} MB</span></div>
                <div className="flex justify-between"><span className="text-slate-500">MIME Type:</span><span className="text-slate-200">{fileMeta.type}</span></div>
              </div>
            )}

            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex justify-center">
                <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded-lg" />
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!file || loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-black font-extrabold text-sm hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "Analyzing..." : "Analyze Media"}</span>
              </button>
              {file && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {loading && (
            <AnalysisProgress
              steps={[
                "Validating image file container & header",
                "Determining auto classification (Document vs Photo)",
                "Executing Error Level Analysis (ELA)",
                "Scanning noise variance & text bounding boxes",
                "Computing normalized Risk & Trust scores"
              ]}
            />
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <AnalysisResultCard result={result}>
              {/* Classification Badge */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">AUTOMATIC FILE CLASSIFICATION:</span>
                <span className="font-bold font-outfit text-cyan-400 uppercase flex items-center gap-1.5">
                  {result.metadata_info?.image_type === 'document' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  <span>{result.metadata_info?.image_type === 'document' ? 'Document Image' : 'Standard Photo'}</span>
                </span>
              </div>

              {/* View Tabs */}
              <div className="flex gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('canvas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'canvas' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tampered Bounding Box Overlay
                </button>
                {result.metadata_info?.ela_image_path && (
                  <button
                    onClick={() => setActiveTab('ela')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'ela' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Error Level Analysis (ELA Heatmap)
                  </button>
                )}
              </div>

              {/* Tab 1: Region Canvas */}
              {activeTab === 'canvas' && (
                <SuspiciousCanvas
                  imageUrl={previewUrl}
                  regions={result.metadata_info?.suspicious_regions || []}
                />
              )}

              {/* Tab 2: ELA Preview */}
              {activeTab === 'ela' && result.metadata_info?.ela_image_path && (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex justify-center">
                    <img src={result.metadata_info.ela_image_path} alt="ELA Heatmap" className="max-h-64 object-contain rounded-lg" />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center font-mono">
                    ELA Variance: {result.metadata_info.ela_score} | Bright pixels indicate local re-compression deltas.
                  </p>
                </div>
              )}
            </AnalysisResultCard>
          ) : !loading && (
            <div className="glass-panel p-12 rounded-2xl border-slate-800 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <ImageIcon className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm max-w-sm">
                Upload any single image or PDF on the left. Sentinel AI will automatically determine file type and highlight tampered regions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
