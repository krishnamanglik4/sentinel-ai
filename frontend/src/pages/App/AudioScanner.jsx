import React, { useState } from 'react';
import { Mic, Upload, Play, Pause, AlertTriangle, CheckCircle2, Music, Sparkles } from 'lucide-react';
import { scanAudioApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreMeter } from '../../components/ui/ScoreMeter';
import { WaveformVisualizer } from '../../components/ui/WaveformVisualizer';

export const AudioScanner = () => {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const audioRef = React.useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setAudioUrl(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
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
      const res = await scanAudioApi(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Audio analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <Mic className="w-3.5 h-3.5" />
          <span>MODULE 04 — SYNTHETIC VOICE SCANNER</span>
        </div>
        <h1 className="text-2xl font-bold font-outfit text-white">AI Voice Clone & Audio Scanner</h1>
        <p className="text-xs text-slate-400">
          Upload suspicious voice messages or phone call recordings to inspect MFCC feature envelopes, pitch stability, and neural vocoder artifacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleUpload} className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : "Drop Voice Recording Here"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports MP3, WAV, OGG, M4A, FLAC (Max 50MB)</p>
              </div>
            </div>

            {audioUrl && (
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <WaveformVisualizer waveform={result?.metadata_info?.waveform_data} isPlaying={isPlaying} />
                  </div>
                </div>
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 text-black font-extrabold text-sm hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Analyzing Acoustic Spectrum..." : "Scan Voice Audio"}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">AI VOICE CLONE PROBABILITY</span>
                  <div className="text-xl font-bold font-outfit text-emerald-400">
                    {Math.round((result.metadata_info?.synthetic_voice_probability || 0.1) * 100)}% Synthetic
                  </div>
                </div>
                <RiskBadge level={result.threat_level} size="lg" />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center justify-items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <ScoreMeter score={result.risk_score} label="Risk Score" size={130} />
                <ScoreMeter score={result.trust_score} label="Trust Score" size={130} />
              </div>

              {result.metadata_info?.spectrogram_url && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 font-outfit uppercase">Mel-Spectrogram Acoustic Envelope</div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex justify-center">
                    <img src={result.metadata_info.spectrogram_url} alt="Spectrogram" className="w-full h-36 object-cover rounded-lg" />
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3">Acoustic Signal Breakdown</h4>
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

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-200 space-y-1">
                <div className="font-bold text-cyan-400 uppercase tracking-wider font-mono">RECOMMENDED ACTION</div>
                <p className="leading-relaxed">{result.recommended_action}</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border-slate-800 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <Music className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Upload an audio recording to inspect voice clone probability and spectrographic signatures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
