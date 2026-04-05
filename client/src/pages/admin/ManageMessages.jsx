import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, MessageSquare, Mail, CheckCircle } from "lucide-react";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => api.get("/contact").then(res => setMessages(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchMessages(); }, []);

  const markRead = async id => {
    await api.put(`/contact/${id}/read`);
    fetchMessages();
    if (selected?._id === id) setSelected({ ...selected, isRead: true });
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
          <h1 className="text-white text-3xl font-bold">Contact Messages</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No messages yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              {messages.map(msg => (
                <motion.div key={msg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg._id); }}
                  className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selected?._id === msg._id ? "border-[#0038B8]" : "border-[#0038B8]/10"} ${!msg.isRead ? "border-l-4 border-l-[#0038B8]" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#0038B8] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{msg.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-[#001F6B] font-bold text-sm">{msg.name}</p>
                        <p className="text-[#001F6B]/50 text-xs">{msg.email}</p>
                      </div>
                    </div>
                    {msg.isRead ? <CheckCircle size={16} className="text-green-500" /> : <div className="w-2 h-2 bg-[#0038B8] rounded-full mt-1" />}
                  </div>
                  <p className="text-[#001F6B] text-sm font-semibold mb-1">{msg.subject}</p>
                  <p className="text-[#001F6B]/50 text-xs line-clamp-2">{msg.message}</p>
                  <p className="text-[#001F6B]/30 text-xs mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>

            {selected && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 h-fit sticky top-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#0038B8] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{selected.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[#001F6B] font-bold">{selected.name}</p>
                    <p className="text-[#001F6B]/50 text-sm flex items-center gap-1"><Mail size={12} />{selected.email}</p>
                  </div>
                </div>
                <h3 className="text-[#001F6B] font-bold text-lg mb-3">{selected.subject}</h3>
                <p className="text-[#001F6B]/70 leading-relaxed text-sm">{selected.message}</p>
                <p className="text-[#001F6B]/30 text-xs mt-6">{new Date(selected.createdAt).toLocaleString()}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
