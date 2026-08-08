import React, { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { scanTextApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreMeter } from '../../components/ui/ScoreMeter';

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
          Paste an SMS, WhatsApp text, email body, or social media request to detect artificial urgency, financial lures, and OTP harvesting.
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
            placeholder="Paste text here..."
            className="w-full p-4 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !message}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white font-bold text-sm hover:shadow-glow-violet transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Evaluating Language Intent..." : "Analyze Message"}</span>
        </button>
      </form>

      {result && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">NLP MODEL SCAM LIKELIHOOD</span>
              <div className="text-xl font-bold font-outfit text-cyan-400">
                {int_prob(result.metadata_info?.scam_probability)}% Probability
              </div>
            </div>
            <RiskBadge level={result.threat_level} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <ScoreMeter score={result.risk_score} label="Risk Score" size={140} />
            </div>
            <div className="flex justify-center">
              <ScoreMeter score={result.trust_score} label="Trust Score" size={140} />
            </div>
          </div>

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

          <div>
            <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3">Detected Pattern Signals</h4>
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

const int_prob = (val) => (val ? Math.round(val * 100) : 50);
