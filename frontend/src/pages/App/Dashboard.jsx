import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Image as ImageIcon, 
  Globe, 
  MessageSquare, 
  Mic, 
  Video, 
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDashboardStatsApi, getScansApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreMeter } from '../../components/ui/ScoreMeter';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsData = await getDashboardStatsApi();
      setStats(statsData);

      const historyData = await getScansApi({ page: 1, size: 5 });
      setRecentScans(historyData.items || []);
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const quickScanners = [
    { title: "Analyze Image / Doc", icon: ImageIcon, path: "/app/scanner/image", desc: "ELA & OCR Forensics", color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400" },
    { title: "Check Suspicious URL", icon: Globe, path: "/app/scanner/url", desc: "Domain Typosquatting", color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400" },
    { title: "Analyze Text Message", icon: MessageSquare, path: "/app/scanner/message", desc: "Urgency & OTP Triggers", color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400" },
    { title: "Analyze Voice Audio", icon: Mic, path: "/app/scanner/audio", desc: "MFCC Synthetic Speech", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400" },
    { title: "Analyze Video Stream", icon: Video, path: "/app/scanner/video", desc: "Deepfake Facial ROI", color: "from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-400" },
  ];

  const chartColors = {
    SAFE: '#10b981',
    LOW: '#06b6d4',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#ef4444'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
            <span>Security Operations Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400">Real-time digital fraud monitoring and forensic metrics overview</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Gauge Card */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 lg:col-span-2 flex items-center justify-around">
          <ScoreMeter score={stats?.overall_security_score ?? 100} label="Security Score" size={130} />
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">STATUS HEALTH</span>
            <div className="text-lg font-bold font-outfit text-white">
              {stats?.overall_security_score >= 80 ? 'Optimal Protection' : stats?.overall_security_score >= 50 ? 'Elevated Vigilance' : 'Action Required'}
            </div>
            <p className="text-xs text-slate-400 max-w-[180px]">
              Calculated across {stats?.total_scans ?? 0} historical forensic scans.
            </p>
          </div>
        </div>

        {/* Counter Card 1 */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Scans</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-outfit text-white mt-2">
            {stats?.total_scans ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-modal requests</div>
        </div>

        {/* Counter Card 2 */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Threats Flagged</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-outfit text-amber-400 mt-2">
            {stats?.threats_detected ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Non-safe detections</div>
        </div>

        {/* Counter Card 3 */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Critical Threats</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold font-outfit text-red-400 mt-2">
            {stats?.critical_threats ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High probability scam/fake</div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <h2 className="text-sm font-bold font-outfit uppercase tracking-wider text-slate-400 mb-3">Quick Launch Forensic Scanners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {quickScanners.map((qs) => {
            const Icon = qs.icon;
            return (
              <Link
                key={qs.title}
                to={qs.path}
                className={`p-4 rounded-xl border bg-gradient-to-br transition-all hover:scale-[1.02] flex flex-col justify-between ${qs.color}`}
              >
                <div>
                  <Icon className="w-5 h-5 mb-2" />
                  <div className="font-bold font-outfit text-sm text-white">{qs.title}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{qs.desc}</div>
                </div>
                <div className="flex items-center justify-end mt-4">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart & Recent Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-outfit text-white mb-1">Threat Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown by threat severity level</p>
          </div>

          <div className="h-64 w-full">
            {stats?.threat_distribution && stats.threat_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.threat_distribution}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.threat_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[entry.name] || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No scan history logged yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans Table */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-outfit text-white">Recent Forensic Feed</h3>
                <p className="text-xs text-slate-400">Latest content submissions analyzed</p>
              </div>
              <Link to="/app/history" className="text-xs font-semibold text-cyan-400 hover:underline">
                View Full Log
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="pb-3 font-semibold">MODULE</th>
                    <th className="pb-3 font-semibold">INPUT SUMMARY</th>
                    <th className="pb-3 font-semibold">THREAT TYPE</th>
                    <th className="pb-3 font-semibold text-center">LEVEL</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {recentScans.length > 0 ? (
                    recentScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-cyan-400 uppercase">{scan.scan_type}</td>
                        <td className="py-3 max-w-[160px] truncate font-medium text-white">{scan.input_summary}</td>
                        <td className="py-3 max-w-[180px] truncate text-slate-400">{scan.threat_type}</td>
                        <td className="py-3 text-center">
                          <RiskBadge level={scan.threat_level} size="sm" />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/app/scans/${scan.id}`}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-white font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">
                        No scans recorded yet. Submit content using the scanners above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
