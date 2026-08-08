import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, Sparkles } from 'lucide-react';
import { scanTextApi } from '../../api/scans';
import { AnalysisProgress } from '../../components/ui/AnalysisProgress';
import { AnalysisResultCard } from '../../components/ui/AnalysisResultCard';

export const MessageScanner = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const sampleScam = "URGENT: Your bank account has been locked due to suspicious activity. Send your 6-digit OTP code to verify identity within 2 hours or face permanent suspension: http://bit.ly/bank-unlock-verify";

  const handleScan = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await scanTextApi(message);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Message analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>MODULE 03 — NLP SCAM DETECTOR</span>
        </div>
        <h1 className="text-2xl font-bold font-outfit text-white">Scam & Phishing Message Scanner</h1>
        <p className="text-xs text-slate-400">
          Paste a suspicious SMS, WhatsApp message, email, or social media text to evaluate artificial urgency, OTP requests, and financial lures.
        </p>
      </div>

      <form onSubmit={handleScan} className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Suspicious Message Body</label>
            <button
              type="button"
              onClick={() => setMessage(sampleScam)}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              Paste Sample Phishing SMS
            </button>
          </div>
          <textarea
            rows="5"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste suspicious message text here..."
            className="w-full p-4 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !message}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white font-bold text-sm hover:shadow-glow-violet transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Analyzing Intent..." : "Analyze Message"}</span>
        </button>
      </form>

      {loading && (
        <AnalysisProgress
          steps={[
            "Parsing natural language n-gram tokens",
            "Checking artificial urgency & psychological pressure",
            "Evaluating OTP & credential harvesting requests",
            "Running TF-IDF Machine Learning Classifier",
            "Computing normalized Risk & Trust scores"
          ]}
        />
      )}

      {result && !loading && (
        <AnalysisResultCard result={result}>
          {result.metadata_info?.highlighted_terms?.length > 0 && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-mono">Trigger Keywords Flagged</div>
              <div className="flex flex-wrap gap-2">
                {result.metadata_info.highlighted_terms.map((term, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 text-xs font-mono border border-red-500/40">
                    "{term}"
                  </span>
                ))}
              </div>
            </div>
          )}
        </AnalysisResultCard>
      )}
    </div>
  );
};
