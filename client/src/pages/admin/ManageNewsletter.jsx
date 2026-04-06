import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, Mail, Users } from "lucide-react";

export default function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = () => api.get("/newsletter/subscribers").then(res => setSubscribers(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchSubs(); }, []);

  const unsubscribe = async id => { if (!confirm("Unsubscribe this person?")) return; await api.put(`/newsletter/${id}/unsubscribe`); fetchSubs(); };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-3xl font-bold">Newsletter Subscribers</h1>
            <div className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
              <Users size={16} /> {subscribers.length} Subscribers
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20"><Mail size={48} className="text-[#0038B8]/30 mx-auto mb-4" /><p className="text-[#001F6B]/50">No subscribers yet.</p></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#0038B8]/10 overflow-hidden">
            <div className="h-1 bg-[#0038B8]" />
            <div className="divide-y divide-[#0038B8]/10">
              {subscribers.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0038B8] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{s.email[0].toUpperCase()}</span>
                    </div>
                    <div>
                      {s.name && <p className="text-[#001F6B] font-semibold text-sm">{s.name}</p>}
                      <p className="text-[#001F6B]/60 text-sm">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[#001F6B]/30 text-xs">{new Date(s.createdAt).toLocaleDateString()}</p>
                    <button onClick={() => unsubscribe(s.id)} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1 rounded-full transition-colors font-semibold">
                      Remove
                    </button>
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
