import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, Users, Calendar, Phone, Mail, Trash2, Download, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";

export default function ManageRSVP() {
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEvent, setFilterEvent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rsvpRes, statsRes] = await Promise.all([
        api.get("/rsvp"),
        api.get("/rsvp/stats")
      ]);
      setRsvps(rsvpRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (err) {} 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/rsvp/${id}/status`, { status });
    fetchData();
  };

  const handleDelete = async id => {
    if (!confirm("Delete this RSVP?")) return;
    await api.delete(`/rsvp/${id}`);
    fetchData();
    if (selected?.id === id) setSelected(null);
  };

  const exportCSV = () => {
    const csv = ["Name,Email,Phone,Event,Guests,Status,Date",
      ...filtered.map(r => `${r.name},${r.email},${r.phone || "N/A"},${r.eventTitle},${r.guests},${r.status},${new Date(r.createdAt).toLocaleDateString()}`)
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "rsvps.csv"; a.click();
  };

  const events = ["all", ...new Set(rsvps.map(r => r.eventTitle))];

  const filtered = rsvps.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.toLowerCase());
    const matchEvent = filterEvent === "all" || r.eventTitle === filterEvent;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchEvent && matchStatus;
  });

  const statusConfig = {
    confirmed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">RSVP Management</h1>
            <p className="text-white/60 text-sm mt-1">{filtered.length} registrations</p>
          </div>
          <button onClick={exportCSV} className="bg-white text-[#0038B8] font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-white/90">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total RSVPs", value: stats.total, color: "#0038B8", icon: Users },
              { label: "Confirmed", value: stats.confirmed, color: "#16a34a", icon: CheckCircle },
              { label: "Cancelled", value: stats.cancelled, color: "#dc2626", icon: XCircle },
              { label: "Total Guests", value: stats.totalGuests, color: "#7c3aed", icon: Users },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}20` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                <p className="text-[#001F6B]/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Event Stats */}
        {stats?.byEvent?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h3 className="text-[#001F6B] font-bold mb-4">RSVPs by Event</h3>
            <div className="flex flex-col gap-3">
              {stats.byEvent.map(({ _id, count, guests }) => (
                <div key={_id} className="flex items-center gap-4">
                  <p className="text-[#001F6B] text-sm font-semibold flex-1 truncate">{_id}</p>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-[#0038B8] font-bold bg-[#0038B8]/10 px-2 py-1 rounded-full">{count} RSVPs</span>
                    <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded-full">{guests} guests</span>
                  </div>
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-[#0038B8] h-2 rounded-full" style={{ width: `${Math.min((count / stats.total) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0038B8]/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or event..."
              className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none text-[#001F6B] bg-white" />
          </div>
          <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)}
            className="border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2.5 text-sm outline-none text-[#001F6B] bg-white">
            {events.map(e => <option key={e} value={e}>{e === "all" ? "All Events" : e}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-2.5 text-sm outline-none text-[#001F6B] bg-white">
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-[#0038B8]/20 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-xl font-bold mb-2">No RSVPs Yet</h3>
            <p className="text-[#001F6B]/50 text-sm">RSVPs will appear here when people register for events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RSVP List */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {filtered.map(rsvp => {
                const sc = statusConfig[rsvp.status] || statusConfig.confirmed;
                const StatusIcon = sc.icon;
                return (
                  <motion.div key={rsvp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => setSelected(rsvp)}
                    className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selected?.id === rsvp.id ? "border-[#0038B8] ring-2 ring-[#0038B8]/20" : "border-[#0038B8]/10"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-[#0038B8] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-sm">{rsvp.name[0].toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#001F6B] font-bold text-sm truncate">{rsvp.name}</p>
                          <p className="text-[#001F6B]/50 text-xs truncate">{rsvp.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <StatusIcon size={10} /> {rsvp.status}
                        </span>
                        <button onClick={e => { e.stopPropagation(); handleDelete(rsvp.id); }}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-[#001F6B]/50 text-xs">
                        <Calendar size={12} className="text-[#0038B8]" />
                        <span className="truncate">{rsvp.eventTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#001F6B]/50 text-xs shrink-0">
                        <Users size={12} className="text-[#0038B8]" />
                        <span>{rsvp.guests} guest{rsvp.guests > 1 ? "s" : ""}</span>
                      </div>
                      <span className="text-[#001F6B]/30 text-xs ml-auto shrink-0">{new Date(rsvp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Detail Panel */}
            {selected ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-[#0038B8]/10 h-fit sticky top-24 relative overflow-hidden">
                <div className="h-1 bg-[#0038B8]" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#001F6B] font-bold text-lg">RSVP Details</h3>
                    <button onClick={() => setSelected(null)} className="text-[#001F6B]/30 hover:text-[#001F6B] text-xl">✕</button>
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-[#0038B8] rounded-full flex items-center justify-center mb-3">
                      <span className="text-white font-bold text-2xl">{selected.name[0].toUpperCase()}</span>
                    </div>
                    <h4 className="text-[#001F6B] font-bold text-lg">{selected.name}</h4>
                    <p className="text-[#001F6B]/50 text-sm">{selected.email}</p>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-4 mb-6">
                    {[
                      { icon: Calendar, label: "Event", value: selected.eventTitle },
                      { icon: Users, label: "Guests", value: `${selected.guests} guest${selected.guests > 1 ? "s" : ""}` },
                      { icon: Phone, label: "Phone", value: selected.phone || "Not provided" },
                      { icon: Mail, label: "Email", value: selected.email },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#0038B8]/10 rounded-lg flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-[#0038B8]" />
                        </div>
                        <div>
                          <p className="text-[#001F6B]/40 text-xs uppercase tracking-wider">{label}</p>
                          <p className="text-[#001F6B] font-semibold text-sm">{value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#0038B8]/10 rounded-lg flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-[#0038B8]" />
                      </div>
                      <div>
                        <p className="text-[#001F6B]/40 text-xs uppercase tracking-wider">Registered</p>
                        <p className="text-[#001F6B] font-semibold text-sm">{new Date(selected.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Change */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-[#001F6B] text-sm font-bold mb-3">Update Status</p>
                    <div className="flex flex-col gap-2">
                      {["confirmed", "pending", "cancelled"].map(status => (
                        <button key={status} onClick={() => { handleStatusChange(selected.id, status); setSelected({...selected, status}); }}
                          className={`py-2.5 rounded-xl text-sm font-bold capitalize transition-all flex items-center justify-center gap-2 ${
                            selected.status === status
                              ? status === "confirmed" ? "bg-green-500 text-white"
                              : status === "cancelled" ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}>
                          {status === "confirmed" ? <CheckCircle size={14} /> : status === "cancelled" ? <XCircle size={14} /> : <Clock size={14} />}
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => handleDelete(selected.id)}
                    className="w-full mt-4 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Delete RSVP
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 flex flex-col items-center justify-center text-center h-64">
                <Users size={32} className="text-[#0038B8]/20 mb-3" />
                <p className="text-[#001F6B]/40 text-sm">Click on an RSVP to view full details</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
