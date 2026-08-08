import React, { useState } from 'react';
import { Globe, Search, AlertTriangle, Sparkles } from 'lucide-react';
import { scanUrlApi } from '../../api/scans';
import { AnalysisProgress } from '../../components/ui/AnalysisProgress';
import { AnalysisResultCard } from '../../components/ui/AnalysisResultCard';

export const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await scanUrlApi(url);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'URL scan failed. Please check host formatting.');
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
        <h1 className="text-2xl font-bold font-outfit text-white">Check a Suspicious Website or URL</h1>
        <p className="text-xs text-slate-400">
          Paste any web link to inspect HTTPS encryption, domain typosquatting, raw IP usage, subdomains, and credential harvest terms.
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
          <span>{loading ? "Scanning..." : "Analyze URL"}</span>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <AnalysisProgress
          steps={[
            "Parsing URL protocol & domain structure",
            "Checking numerical IP host concealment",
            "Evaluating high-risk TLD extension registry",
            "Extracting brand spoofing & credential keywords",
            "Computing normalized Risk & Trust scores"
          ]}
        />
      )}

      {result && !loading && (
        <AnalysisResultCard result={result}>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white uppercase font-mono mb-2">Domain Parameter Inspection</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-400 font-mono">
              <div><span className="text-slate-500 block">Domain:</span><strong className="text-slate-200">{result.metadata_info?.domain}</strong></div>
              <div><span className="text-slate-500 block">Scheme:</span><strong className="text-slate-200">{result.metadata_info?.scheme}</strong></div>
              <div><span className="text-slate-500 block">Subdomains:</span><strong className="text-slate-200">{result.metadata_info?.subdomain_count}</strong></div>
              <div><span className="text-slate-500 block">Raw IP:</span><strong className={result.metadata_info?.has_ip ? 'text-red-400' : 'text-slate-200'}>{result.metadata_info?.has_ip ? 'Yes (High Risk)' : 'No'}</strong></div>
            </div>
          </div>
        </AnalysisResultCard>
      )}
    </div>
  );
};
