import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, BookOpen } from "lucide-react";

const empty = { title: "", content: "", scripture: "", week: "", author: "" };

export default function ManageBibleStudy() {
  const [studies, setStudies] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStudies = () => api.get("/bible-studies/all").then(res => setStudies(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchStudies(); }, []);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/bible-studies/${editing}`, form);
      else await api.post("/bible-studies", form);
      setForm(empty); setEditing(null); setShowForm(false); fetchStudies();
    } catch (err) { alert(err.response?.data?.message || "Error"); }
    finally { setLoading(false); }
  };

  const handleEdit = s => { setForm({ title: s.title, content: s.content, scripture: s.scripture, week: s.week, author: s.author }); setEditing(s._id); setShowForm(true); };
  const handleDelete = async id => { if (!confirm("Delete?")) return; await api.delete(`/bible-studies/${id}`); fetchStudies(); };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Bible Study Notes</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90">
            <Plus size={18} /> Add Study
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit Study" : "Add Bible Study"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[["title","Title","e.g. The Sabbath in Genesis"],["scripture","Scripture Reference","e.g. Genesis 2:1-3"],["week","Week/Date","e.g. Week 1 - April 2025"],["author","Author/Teacher","e.g. Pastor John"]].map(([name,label,placeholder]) => (
                <div key={name}>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">{label}</label>
                  <input name={name} value={form[name]} onChange={e => setForm({...form, [name]: e.target.value})} required placeholder={placeholder}
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Study Content</label>
                <textarea name="content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required rows={8} placeholder="Write the full study notes here..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Saving..." : editing ? "Update" : "Publish Study"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
        {studies.length === 0 ? (
          <div className="text-center py-20"><BookOpen size={48} className="text-[#0038B8]/30 mx-auto mb-4" /><p className="text-[#001F6B]/50">No studies yet.</p></div>
        ) : (
          <div className="flex flex-col gap-4">
            {studies.map(s => (
              <div key={s._id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-2 py-1 rounded-full mb-2 inline-block">{s.week}</span>
                  <h3 className="text-[#001F6B] font-bold">{s.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm">{s.scripture} · By {s.author}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(s)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(s._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
