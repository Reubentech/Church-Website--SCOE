import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, Activity, Trash2 } from "lucide-react";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchLogs = () => {
    api.get("/logs?limit=100").then(res => { setLogs(res.data.data || []); setTotal(res.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  const clearLogs = async () => {
    if (!confirm("Clear all activity logs?")) return;
    await api.delete("/logs");
    fetchLogs();
  };

  const actionColors = {
    CREATE: "bg-green-100 text-green-700",
    UPDATE: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
    LOGIN: "bg-purple-100 text-purple-700",
    VIEW: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Activity Logs</h1>
            <p className="text-white/60 text-sm mt-1">{total} total log entries</p>
          </div>
          <button onClick={clearLogs} className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Trash2 size={16} /> Clear All Logs
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <Activity size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No activity logs yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#0038B8]/10 overflow-hidden">
            <div className="h-1 bg-[#0038B8]" />
            <div className="divide-y divide-[#0038B8]/5">
              {logs.map((log, i) => (
                <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="px-6 py-4 flex items-start gap-4 hover:bg-[#F0F5FF] transition-colors">
                  <div className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${actionColors[log.action] || "bg-gray-100 text-gray-600"}`}>
                    {log.action}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#001F6B] font-semibold text-sm">{log.userName}</span>
                      <span className="text-[#001F6B]/40 text-xs">·</span>
                      <span className="text-[#0038B8] text-xs font-semibold">{log.resource}</span>
                      {log.details && <span className="text-[#001F6B]/60 text-xs truncate">{log.details}</span>}
                    </div>
                    <p className="text-[#001F6B]/30 text-xs mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
