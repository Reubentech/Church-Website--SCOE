import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, Calendar } from "lucide-react";

const empty = { title: "", description: "", date: "", time: "", location: "", category: "worship" };

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEvents = () => api.get("/events/all").then(res => setEvents(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchEvents(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) { await api.put(`/events/${editing}`, form); }
      else { await api.post("/events", form); }
      setForm(empty); setEditing(null); setShowForm(false);
      fetchEvents();
    } catch (err) { alert(err.response?.data?.message || "Error saving event"); }
    finally { setLoading(false); }
  };

  const handleEdit = event => {
    setForm({ title: event.title, description: event.description, date: event.date?.slice(0, 10), time: event.time, location: event.location, category: event.category });
    setEditing(event.id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back to Dashboard</Link>
            <h1 className="text-white text-3xl font-bold">Manage Events</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90 transition-all">
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit Event" : "Add New Event"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Event Title"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Event description..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Time</label>
                <input name="time" value={form.time} onChange={handleChange} required placeholder="9:00 AM"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Location</label>
                <input name="location" value={form.location} onChange={handleChange} required placeholder="Head quaters, Murichu, Kenya"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]">
                  {["worship","bible-study","prayer","youth","community","special"].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors flex items-center gap-2 disabled:opacity-60">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editing ? "Update Event" : "Create Event"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No events yet. Add your first event!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map(event => (
              <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-2 py-1 rounded-full capitalize mb-2 inline-block">{event.category}</span>
                  <h3 className="text-[#001F6B] font-bold">{event.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm">{new Date(event.date).toLocaleDateString()} · {event.time} · {event.location}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(event)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl transition-colors"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
