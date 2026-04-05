import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, Bell } from "lucide-react";

const empty = { message: "", type: "info", isActive: true, link: "", linkText: "" };

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAll = () => api.get("/announcements/all").then(res => setAnnouncements(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/announcements/${editing}`, form);
      else await api.post("/announcements", form);
      setForm(empty); setEditing(null); setShowForm(false); fetchAll();
    } catch (err) { alert("Error saving"); }
    finally { setLoading(false); }
  };

  const handleEdit = a => { setForm({ message: a.message, type: a.type, isActive: a.isActive, link: a.link || "", linkText: a.linkText || "" }); setEditing(a._id); setShowForm(true); };
  const handleDelete = async id => { if (!confirm("Delete?")) return; await api.delete(`/announcements/${id}`); fetchAll(); };
  const toggleActive = async (id, isActive) => { await api.put(`/announcements/${id}`, { isActive: !isActive }); fetchAll(); };

  const typeColors = { info: "bg-[#0038B8]/10 text-[#0038B8]", warning: "bg-amber-100 text-amber-600", success: "bg-green-100 text-green-600" };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Announcements</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90">
            <Plus size={18} /> Add Announcement
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit" : "New"} Announcement</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Message</label>
                <input value={form.message} onChange={e => setForm({...form, message: e.target.value})} required placeholder="Announcement message..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]">
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="success">Success (Green)</option>
                </select>
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Link (optional)</label>
                <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} id="active" className="w-4 h-4" />
                <label htmlFor="active" className="text-[#001F6B] text-sm font-bold cursor-pointer">Active (visible on site)</label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Saving..." : editing ? "Update" : "Publish"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
        {announcements.length === 0 ? (
          <div className="text-center py-20"><Bell size={48} className="text-[#0038B8]/30 mx-auto mb-4" /><p className="text-[#001F6B]/50">No announcements yet.</p></div>
        ) : (
          <div className="flex flex-col gap-4">
            {announcements.map(a => (
              <div key={a._id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${typeColors[a.type]}`}>{a.type}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${a.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {a.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-[#001F6B] font-semibold text-sm">{a.message}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => toggleActive(a._id, a.isActive)} className={`p-2 rounded-xl transition-colors text-xs font-bold px-3 ${a.isActive ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                    {a.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleEdit(a)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(a._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
