import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, FileText, X } from "lucide-react";
import { format } from "date-fns";

const empty = {
  title: "", week: "", date: "", content: "", scripture: "",
  announcements: [""], isPublished: true,
};

export default function ManageBulletin() {
  const [bulletins, setBulletins] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBulletins = () => api.get("/bulletin/all").then(res => setBulletins(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchBulletins(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, announcements: form.announcements.filter(a => a.trim()) };
      if (editing) await api.put(`/bulletin/${editing}`, data);
      else await api.post("/bulletin", data);
      setForm(empty); setEditing(null); setShowForm(false);
      fetchBulletins();
    } catch (err) { alert(err.response?.data?.message || "Error saving bulletin"); }
    finally { setLoading(false); }
  };

  const handleEdit = b => {
    setForm({
      title: b.title, week: b.week, date: b.date?.slice(0, 10),
      content: b.content, scripture: b.scripture || "",
      announcements: b.announcements?.length ? b.announcements : [""],
      isPublished: b.isPublished,
    });
    setEditing(b.id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this bulletin?")) return;
    await api.delete(`/bulletin/${id}`); fetchBulletins();
  };

  const updateAnnouncement = (i, val) => {
    const updated = [...form.announcements];
    updated[i] = val;
    setForm({ ...form, announcements: updated });
  };

  const addAnnouncement = () => setForm({ ...form, announcements: [...form.announcements, ""] });

  const removeAnnouncement = i => {
    const updated = form.announcements.filter((_, idx) => idx !== i);
    setForm({ ...form, announcements: updated.length ? updated : [""] });
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Church Bulletin</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90">
            <Plus size={18} /> New Bulletin
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit Bulletin" : "Create New Bulletin"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Bulletin Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                    placeholder="e.g. Sabbath Bulletin — April 5, 2026"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Week Label</label>
                  <input value={form.week} onChange={e => setForm({ ...form, week: e.target.value })} required
                    placeholder="e.g. Week of April 5, 2026"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Scripture (Reference + Verse)</label>
                  <input value={form.scripture} onChange={e => setForm({ ...form, scripture: e.target.value })}
                    placeholder='e.g. Isaiah 58:13 — "If you turn away your foot..."'
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              </div>

              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Welcome / Opening Message</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={4}
                  placeholder="Opening message or welcome from the pastor..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#001F6B] text-sm font-bold">Announcements</label>
                  <button type="button" onClick={addAnnouncement}
                    className="text-xs text-[#0038B8] font-bold hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {form.announcements.map((ann, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={ann} onChange={e => updateAnnouncement(i, e.target.value)}
                        placeholder={`Announcement ${i + 1}...`}
                        className="flex-1 border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2 text-sm outline-none text-[#001F6B]" />
                      {form.announcements.length > 1 && (
                        <button type="button" onClick={() => removeAnnouncement(i)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="pub" className="text-[#001F6B] text-sm font-bold">Published</label>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Saving..." : editing ? "Update Bulletin" : "Publish Bulletin"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {bulletins.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No bulletins yet. Create your first weekly bulletin!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bulletins.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-2 py-1 rounded-full mb-2 inline-block">{b.week}</span>
                  {!b.isPublished && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">Draft</span>}
                  <h3 className="text-[#001F6B] font-bold mt-1">{b.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm">{format(new Date(b.date), "EEEE, MMMM d, yyyy")} · {b.announcements?.length || 0} announcements</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(b)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
