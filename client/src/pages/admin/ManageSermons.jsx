import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, BookOpen } from "lucide-react";

const empty = { title: "", description: "", speaker: "", date: "", type: "video", videoLink: "", isPremium: false, price: 0 };

export default function ManageSermons() {
  const [sermons, setSermons] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSermons = () => api.get("/sermons/all").then(res => setSermons(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchSermons(); }, []);

  const handleChange = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("file", file);
      if (editing) await api.put(`/sermons/${editing}`, form);
      else await api.post("/sermons", data);
      setForm(empty); setEditing(null); setShowForm(false); setFile(null);
      fetchSermons();
    } catch (err) { alert(err.response?.data?.message || "Error saving sermon"); }
    finally { setLoading(false); }
  };

  const handleEdit = s => {
    setForm({ title: s.title, description: s.description, speaker: s.speaker, date: s.date?.slice(0, 10), type: s.type, videoLink: s.videoLink || "", isPremium: s.isPremium, price: s.price });
    setEditing(s.id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this sermon?")) return;
    await api.delete(`/sermons/${id}`); fetchSermons();
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Manage Sermons</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90 transition-all">
            <Plus size={18} /> Add Sermon
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit Sermon" : "Add New Sermon"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[["title","Title","Sermon title"],["speaker","Speaker","Speaker name"]].map(([name, label, placeholder]) => (
                <div key={name}>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">{label}</label>
                  <input name={name} value={form[name]} onChange={handleChange} required placeholder={placeholder}
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Type</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]">
                  {["video","audio","pdf"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
              {form.type === "video" && (
                <div className="md:col-span-2">
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Video Link (YouTube/Vimeo)</label>
                  <input name="videoLink" value={form.videoLink} onChange={handleChange} placeholder="https://youtube.com/..."
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              )}
              {(form.type === "audio" || form.type === "pdf") && !editing && (
                <div className="md:col-span-2">
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Upload File</label>
                  <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf,.mp3,.wav"
                    className="w-full border-2 border-[#0038B8]/20 rounded-xl px-4 py-3 text-sm text-[#001F6B]" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" name="isPremium" checked={form.isPremium} onChange={handleChange} id="premium" className="w-4 h-4" />
                <label htmlFor="premium" className="text-[#001F6B] text-sm font-bold">Premium Content</label>
              </div>
              {form.isPremium && (
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Price (KES)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange}
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              )}
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Saving..." : editing ? "Update" : "Create Sermon"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {sermons.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No sermons yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sermons.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-2 py-1 rounded-full uppercase mr-2">{s.type}</span>
                  {s.isPremium && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Premium</span>}
                  <h3 className="text-[#001F6B] font-bold mt-1">{s.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm">By {s.speaker} · {new Date(s.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(s)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
