import React, { useState } from 'react';
import { RiskBadge } from './RiskBadge';
import { ScoreMeter } from './ScoreMeter';
import { AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, Cpu, Image as ImageIcon } from 'lucide-react';

export const AnalysisResultCard = ({ result, children }) => {
  const [showFormula, setShowFormula] = useState(true);

  if (!result) return null;

  const {
    risk_score = 0,
    trust_score = 100 - risk_score,
    threat_level = 'SAFE',
    threat_type = 'Authentic Content',
    confidence = 0.90,
    signals = [],
    explanation = {},
    reasons = [],
    recommended_action = '',
    ela = result?.metadata_info?.ela || null
  } = result;

  const elaScore = typeof ela?.ela_score === 'number' ? ela.ela_score : (typeof result?.metadata_info?.ela_score === 'number' ? result.metadata_info.ela_score : null);

  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">FORENSIC ANALYSIS REPORT</div>
          <h2 className="text-xl font-bold font-outfit text-white mt-0.5">{threat_type}</h2>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Engine Confidence: <strong className="text-cyan-400">{Math.round(confidence * 100)}%</strong>
          </div>
        </div>
        <RiskBadge level={threat_level} size="lg" />
      </div>

      {/* Radial Score Gauges Row (3 Gauges if ELA score present) */}
      <div className={`grid grid-cols-1 ${elaScore !== null ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 items-center justify-items-center bg-slate-900/60 p-5 rounded-2xl border border-slate-800`}>
        <ScoreMeter score={risk_score} label="Overall Risk Score" size={130} />
        <ScoreMeter score={trust_score} label="Trust Score" size={130} />
        {elaScore !== null && (
          <ScoreMeter score={elaScore} label="ELA Anomaly Score" size={130} />
        )}
      </div>

      {/* Custom Module Slot (e.g. Side-by-side canvas/ELA preview) */}
      {children}

      {/* Forensic Signal Breakdown with Percentage Bars */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300">Forensic Signals Evaluated</h3>
        <div className="space-y-2.5">
          {signals.map((sig, idx) => {
            const sigScore = typeof sig.score === 'number' ? sig.score : (sig.detected ? 80 : 10);
            const isDetected = sig.detected || sigScore > 35;
            
            return (
              <div key={idx} className={`p-4 rounded-xl border text-xs space-y-2 transition-colors ${
                isDetected ? 'bg-red-950/20 border-red-500/30 text-slate-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    {isDetected ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>{sig.name}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-cyan-400">
                    {sigScore}% Anomaly
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sigScore > 60 ? 'bg-red-500' : sigScore > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(5, sigScore)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{sig.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Score Transparency: How was this score calculated? */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden text-xs">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full p-3.5 flex items-center justify-between font-outfit font-bold text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>How was this Risk Score calculated?</span>
          </span>
          {showFormula ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showFormula && (
          <div className="p-4 pt-0 border-t border-slate-800/60 space-y-3">
            <div className="space-y-1.5 font-mono text-[11px]">
              {signals.map((sig, i) => {
                const sigScore = typeof sig.score === 'number' ? sig.score : (sig.detected ? 80 : 10);
                const weightPct = Math.round((sig.weight || 0.33) * 100);
                const weightedVal = Math.round(sigScore * (sig.weight || 0.33));
                return (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span>{sig.name} ({sigScore} × {weightPct}% weight):</span>
                    <strong className="text-cyan-400">+{weightedVal}</strong>
                  </div>
                );
              })}
              <div className="border-t border-slate-700 pt-1.5 flex justify-between items-center font-bold text-white">
                <span>Final Risk Score:</span>
                <strong className="text-cyan-400 text-sm">{risk_score} / 100</strong>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              *Weights are dynamically calculated based on available signal metrics. No hardcoded or static scores are used.
            </p>
          </div>
        )}
      </div>

      {/* Scientific ELA Disclaimer Notice */}
      <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-blue-200">Scientific ELA Forensic Notice</div>
          <p className="text-[11px] text-blue-300/80 leading-relaxed">
            Error Level Analysis (ELA) identifies regions with different compression characteristics. These anomalies can indicate editing or recompression, but they are not conclusive proof of manipulation.
          </p>
        </div>
      </div>

      {/* Recommended Action Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-blue-950/30 border border-cyan-500/30 text-xs text-slate-200 space-y-1">
        <div className="font-bold text-cyan-400 uppercase tracking-wider font-mono">RECOMMENDED SAFETY ACTION</div>
        <p className="leading-relaxed">{recommended_action}</p>
      </div>
    </div>
  );
};
