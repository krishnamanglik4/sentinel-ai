import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle2, FileText, Calendar, Clock, Lock } from 'lucide-react';
import { getScanDetailApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreMeter } from '../../components/ui/ScoreMeter';
import { SuspiciousCanvas } from '../../components/ui/SuspiciousCanvas';

export const ScanDetails = () => {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getScanDetailApi(scanId);
        setScan(data);
      } catch (err) {
        setError("Scan record not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [scanId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Loading forensic analysis report...</div>;
  }

  if (error || !scan) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-red-400 font-bold">{error || "Scan record not found."}</div>
        <Link to="/app/history" className="text-xs text-cyan-400 hover:underline">Back to History Log</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/app/history" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Scan History</span>
      </Link>

      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
              <span>SCAN RECORD #{scan.id?.substring(0, 8)}</span>
              <span>•</span>
              <span>MODULE: {scan.scan_type}</span>
            </div>
            <h1 className="text-xl font-bold font-outfit text-white mt-1">{scan.threat_type}</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{scan.input_summary}</p>
          </div>
          <RiskBadge level={scan.threat_level} size="lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
          <div className="flex justify-center">
            <ScoreMeter score={scan.risk_score} label="Risk Score" size={140} />
          </div>
          <div className="flex justify-center">
            <ScoreMeter score={scan.trust_score} label="Trust Score" size={140} />
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white uppercase font-mono mb-2">Audit Metadata</div>
            <div className="flex justify-between"><span className="text-slate-400">Confidence:</span><span className="font-mono text-slate-200">{Math.round(scan.confidence * 100)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Scan ID:</span><span className="font-mono text-slate-200 text-[10px]">{scan.id}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Date:</span><span className="font-mono text-slate-200">{scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'N/A'}</span></div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3">Forensic Signals Recorded</h3>
          <div className="space-y-2">
            {scan.signals?.map((sig, idx) => (
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
          <p className="leading-relaxed">{scan.recommended_action}</p>
        </div>
      </div>
    </div>
  );
};
