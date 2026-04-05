import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, FileText } from "lucide-react";
import { format } from "date-fns";

const empty = {
  title: "", date: "", scripture: "", scriptureText: "", welcomeMessage: "",
  serviceOrder: [{ time: "", activity: "" }],
  announcements: [{ title: "", content: "" }],
  prayerRequests: [""],
  offerings: "", closingThought: "", isPublished: true
};

export default function ManageBulletin() {
  const [bulletins, setBulletins] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBulletins = () => api.get("/bulletins/all").then(res => setBulletins(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchBulletins(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, prayerRequests: form.prayerRequests.filter(p => p.trim()) };
      if (editing) await api.put(`/bulletins/${editing}`, data);
      else await api.post("/bulletins", data);
      setForm(empty); setEditing(null); setShowForm(false);
      fetchBulletins();
    } catch (err) { alert(err.response?.data?.message || "Error"); }
    finally { setLoading(false); }
  };

  const handleEdit = b => {
    setForm({ title: b.title, date: b.date?.slice(0,10), scripture: b.scripture, scriptureText: b.scriptureText, welcomeMessage: b.welcomeMessage, serviceOrder: b.serviceOrder?.length ? b.serviceOrder : [{ time: "", activity: "" }], announcements: b.announcements?.length ? b.announcements : [{ title: "", content: "" }], prayerRequests: b.prayerRequests?.length ? b.prayerRequests : [""], offerings: b.offerings || "", closingThought: b.closingThought || "", isPublished: b.isPublished });
    setEditing(b._id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm("Delete bulletin?")) return;
    await api.delete(`/bulletins/${id}`); fetchBulletins();
  };

  const updateServiceOrder = (i, key, val) => {
    const updated = [...form.serviceOrder];
    updated[i] = { ...updated[i], [key]: val };
    setForm({ ...form, serviceOrder: updated });
  };

  const updateAnnouncement = (i, key, val) => {
    const updated = [...form.announcements];
    updated[i] = { ...updated[i], [key]: val };
    setForm({ ...form, announcements: updated });
  };

  const updatePrayer = (i, val) => {
    const updated = [...form.prayerRequests];
    updated[i] = val;
    setForm({ ...form, prayerRequests: updated });
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Bulletin Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Sabbath Service Bulletin"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Scripture Reference</label>
                  <input value={form.scripture} onChange={e => setForm({...form, scripture: e.target.value})} required placeholder="e.g. Isaiah 58:13-14"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Scripture Text</label>
                  <input value={form.scriptureText} onChange={e => setForm({...form, scriptureText: e.target.value})} required placeholder="The scripture verse..."
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              </div>

              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Welcome Message</label>
                <textarea value={form.welcomeMessage} onChange={e => setForm({...form, welcomeMessage: e.target.value})} required rows={3}
                  placeholder="Welcome message from the pastor..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>

              {/* Service Order */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#001F6B] text-sm font-bold">Order of Service</label>
                  <button type="button" onClick={() => setForm({...form, serviceOrder: [...form.serviceOrder, { time: "", activity: "" }]})}
                    className="text-xs text-[#0038B8] font-bold hover:underline">+ Add Item</button>
                </div>
                {form.serviceOrder.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 mb-2">
                    <input value={item.time} onChange={e => updateServiceOrder(i, "time", e.target.value)} placeholder="10:00 AM"
                      className="border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2 text-sm outline-none text-[#001F6B]" />
                    <input value={item.activity} onChange={e => updateServiceOrder(i, "activity", e.target.value)} placeholder="Opening Prayer" className="col-span-2 border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2 text-sm outline-none text-[#001F6B]" />
                  </div>
                ))}
              </div>

              {/* Announcements */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#001F6B] text-sm font-bold">Announcements</label>
                  <button type="button" onClick={() => setForm({...form, announcements: [...form.announcements, { title: "", content: "" }]})}
                    className="text-xs text-[#0038B8] font-bold hover:underline">+ Add</button>
                </div>
                {form.announcements.map((ann, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 mb-3 bg-[#F0F5FF] p-3 rounded-xl">
                    <input value={ann.title} onChange={e => updateAnnouncement(i, "title", e.target.value)} placeholder="Announcement title"
                      className="border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2 text-sm outline-none text-[#001F6B]" />
                    <textarea value={ann.content} onChange={e => updateAnnouncement(i, "content", e.target.value)} placeholder="Details..." rows={2}
                      className="border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2 text-sm outline-none text-[#001F6B] resize-none" />
                  </div>
                ))}
              </div>

              {/* Prayer Requests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#001F6B] text-sm font-bold">Prayer Requests</label>
                  <button type="button" onClick={() => setForm({...form, prayerRequests: [...form.prayerRequests, ""]})}
                    className="text-xs text-[#0038B8] font-bold hover:underline">+ Add</button>
                </div>
                {form.prayerRequests.map((req, i) => (
                  <input key={i} value={req} onChange={e => updatePrayer(i, e.target.value)} placeholder="Prayer request..."
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2 text-sm outline-none text-[#001F6B] mb-2" />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Offerings Note</label>
                  <input value={form.offerings} onChange={e => setForm({...form, offerings: e.target.value})} placeholder="Tithing and offering details..."
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Closing Thought</label>
                  <input value={form.closingThought} onChange={e => setForm({...form, closingThought: e.target.value})} placeholder="Closing scripture or thought..."
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Saving..." : editing ? "Update Bulletin" : "Publish Bulletin"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl">Cancel</button>
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
              <div key={b._id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div>
                  <h3 className="text-[#001F6B] font-bold">{b.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm">{format(new Date(b.date), "EEEE, MMMM d, yyyy")} · {b.scripture}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(b)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(b._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
