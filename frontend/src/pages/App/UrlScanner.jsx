import React, { useState } from 'react';
import { Globe, Search, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { scanUrlApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreMeter } from '../../components/ui/ScoreMeter';

export const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.strip?.() && !url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await scanUrlApi(url);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'URL scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>MODULE 02 — URL PHISHING INTEL</span>
        </div>
        <h1 className="text-2xl font-bold font-outfit text-white">Malicious & Phishing URL Scanner</h1>
        <p className="text-xs text-slate-400">
          Enter any link to analyze HTTPS certificate validity, domain typosquatting, raw IP usage, subdomains, and credential harvest keywords.
        </p>
      </div>

      <form onSubmit={handleScan} className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Globe className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://verify-bank-account-security-update.com/login"
            className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-sm hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? "Scanning Domain..." : "Check URL"}</span>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {result && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">ANALYZED TARGET</span>
              <div className="text-base font-bold font-mono text-cyan-400 truncate max-w-md">{result.input_summary}</div>
            </div>
            <RiskBadge level={result.threat_level} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex justify-center">
              <ScoreMeter score={result.risk_score} label="Risk Score" size={140} />
            </div>
            <div className="flex justify-center">
              <ScoreMeter score={result.trust_score} label="Trust Score" size={140} />
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white uppercase font-mono mb-2">Domain Metadata</div>
              <div className="flex justify-between"><span className="text-slate-400">Domain:</span><span className="font-mono text-slate-200">{result.metadata_info?.domain}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Scheme:</span><span className="font-mono text-slate-200">{result.metadata_info?.scheme}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Subdomains:</span><span className="font-mono text-slate-200">{result.metadata_info?.subdomain_count}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Raw IP Host:</span><span className="font-mono text-slate-200">{result.metadata_info?.has_ip ? 'Yes (High Risk)' : 'No'}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3">Signal Breakdown</h4>
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
      )}
    </div>
  );
};
