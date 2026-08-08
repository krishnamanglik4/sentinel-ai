import React, { useState } from 'react';
import { Video, Upload, AlertTriangle, Film, Sparkles } from 'lucide-react';
import { scanVideoApi } from '../../api/scans';
import { AnalysisProgress } from '../../components/ui/AnalysisProgress';
import { AnalysisResultCard } from '../../components/ui/AnalysisResultCard';

export const VideoScanner = () => {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setVideoUrl(URL.createObjectURL(selected));
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
      const res = await scanVideoApi(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Video deepfake analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>MODULE 05 — DEEPFAKE VIDEO FORENSICS</span>
        </div>
        <h1 className="text-2xl font-bold font-outfit text-white">Video Deepfake & Facial Manipulation Scanner</h1>
        <p className="text-xs text-slate-400">
          Upload video streams for automated keyframe sampling, OpenCV face detection, inter-frame temporal boundary checks, and deepfake likelihood aggregation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleUpload} className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform mb-3 shadow-lg">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : "Drop Video File"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports MP4, AVI, MOV, MKV, WEBM (Max 50MB)</p>
              </div>
            </div>

            {videoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex justify-center">
                <video src={videoUrl} controls className="max-h-52 w-full object-contain rounded-lg" />
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-violet-600 text-white font-extrabold text-sm hover:shadow-glow-danger transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Sampling Frames..." : "Scan Video Deepfake"}</span>
            </button>
          </form>

          {loading && (
            <AnalysisProgress
              steps={[
                "Decoding video container framerate & timestamps",
                "Sampling keyframe intervals (1 frame / 0.5s)",
                "Executing OpenCV Haar Cascade facial ROI detection",
                "Measuring facial skin texture variance & boundary blurring",
                "Aggregating frame predictions into deepfake score"
              ]}
            />
          )}
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <AnalysisResultCard result={result}>
              {/* Sampled Frames Grid */}
              {result.metadata_info?.frame_thumbnails?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3">Sampled Keyframe Analysis</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.metadata_info.frame_thumbnails.map((frame, idx) => (
                      <div key={idx} className="bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 p-1.5 space-y-1">
                        <img src={frame.thumbnail_url} alt={`Frame ${idx}`} className="w-full h-20 object-cover rounded-md" />
                        <div className="flex items-center justify-between text-[10px] font-mono px-1">
                          <span className="text-slate-400">@{frame.timestamp_sec}s</span>
                          <span className={`font-bold ${frame.risk_score > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {frame.risk_score}% Risk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnalysisResultCard>
          ) : !loading && (
            <div className="glass-panel p-12 rounded-2xl border-slate-800 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <Film className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Upload a video to inspect sampled facial keyframes and deepfake boundaries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
