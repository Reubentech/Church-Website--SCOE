import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, Heart, CheckCircle, Trash2 } from "lucide-react";

export default function ManagePrayers() {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrayers = () => api.get("/prayer-requests").then(res => setPrayers(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchPrayers(); }, []);

  const markAnswered = async id => { await api.put(`/prayer-requests/${id}/answered`); fetchPrayers(); };
  const handleDelete = async id => { if (!confirm("Delete?")) return; await api.delete(`/prayer-requests/${id}`); fetchPrayers(); };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
          <h1 className="text-white text-3xl font-bold">Prayer Requests</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-20"><Heart size={48} className="text-[#0038B8]/30 mx-auto mb-4" /><p className="text-[#001F6B]/50">No prayer requests yet.</p></div>
        ) : (
          <div className="flex flex-col gap-4">
            {prayers.map(p => (
              <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white rounded-2xl p-6 shadow-sm border ${p.isAnswered ? "border-green-200" : "border-[#0038B8]/10"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[#001F6B] font-bold">{p.isAnonymous ? "Anonymous" : p.name}</p>
                      {p.isAnswered && <span className="text-xs bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">Answered</span>}
                    </div>
                    {!p.isAnonymous && p.email && <p className="text-[#001F6B]/50 text-xs mb-2">{p.email}</p>}
                    <p className="text-[#001F6B]/70 text-sm leading-relaxed">{p.request}</p>
                    <p className="text-[#001F6B]/30 text-xs mt-2">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!p.isAnswered && (
                      <button onClick={() => markAnswered(p._id)} className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-colors" title="Mark Answered">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
