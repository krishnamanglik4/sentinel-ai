import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, Filter, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getScansApi, deleteScanApi } from '../../api/scans';
import { RiskBadge } from '../../components/ui/RiskBadge';

export const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [scanType, setScanType] = useState('');
  const [threatLevel, setThreatLevel] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getScansApi({
        page,
        size,
        search: search.trim() || undefined,
        scan_type: scanType || undefined,
        threat_level: threatLevel || undefined,
      });
      setScans(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load scan history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, scanType, threatLevel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scan record?")) return;
    try {
      await deleteScanApi(id);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete scan record.");
    }
  };

  const totalPages = Math.ceil(total / size) || 1;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
          <History className="w-6 h-6 text-cyan-400" />
          <span>Forensic Scan History Log</span>
        </h1>
        <p className="text-xs text-slate-400">Search and review persistent scan logs stored in database</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search URL, filename, or threat keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={scanType}
            onChange={(e) => { setScanType(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Modules</option>
            <option value="image">Image</option>
            <option value="document">Document</option>
            <option value="url">URL</option>
            <option value="text">Message</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>

          <select
            value={threatLevel}
            onChange={(e) => { setThreatLevel(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Threat Levels</option>
            <option value="SAFE">Safe</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono">
                <th className="p-4 font-semibold">TIMESTAMP</th>
                <th className="p-4 font-semibold">MODULE</th>
                <th className="p-4 font-semibold">TARGET / SUMMARY</th>
                <th className="p-4 font-semibold">THREAT EVALUATION</th>
                <th className="p-4 font-semibold text-center">RISK SCORE</th>
                <th className="p-4 font-semibold text-center">LEVEL</th>
                <th className="p-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    Loading scan history...
                  </td>
                </tr>
              ) : scans.length > 0 ? (
                scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      {scan.created_at ? new Date(scan.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4 font-mono font-bold text-cyan-400 uppercase">{scan.scan_type}</td>
                    <td className="p-4 max-w-[200px] truncate font-medium text-white">{scan.input_summary}</td>
                    <td className="p-4 max-w-[220px] truncate text-slate-400">{scan.threat_type}</td>
                    <td className="p-4 text-center font-bold font-mono text-white">{scan.risk_score}/100</td>
                    <td className="p-4 text-center">
                      <RiskBadge level={scan.threat_level} size="sm" />
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/app/scans/${scan.id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-white p-1"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(scan.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No scan logs found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{scans.length}</strong> of <strong className="text-white">{total}</strong> total logs
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
