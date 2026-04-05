import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Search } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";
import api from "../utils/api";

const categoryColors = {
  worship: { bg: "bg-blue-50", text: "text-blue-700" },
  "bible-study": { bg: "bg-purple-50", text: "text-purple-700" },
  prayer: { bg: "bg-green-50", text: "text-green-700" },
  youth: { bg: "bg-orange-50", text: "text-orange-700" },
  community: { bg: "bg-teal-50", text: "text-teal-700" },
  special: { bg: "bg-red-50", text: "text-red-700" },
};

const categoryBarColor = {
  worship: "#0038B8",
  "bible-study": "#7c3aed",
  prayer: "#16a34a",
  youth: "#f97316",
  community: "#0d9488",
  special: "#dc2626",
};

function pad(n) { return String(n).padStart(2, "0"); }

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function CountdownBadge({ date }) {
  const days = differenceInDays(new Date(date), new Date());
  if (days < 0) return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold">Past Event</span>;
  if (days === 0) return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold animate-pulse">Today!</span>;
  if (days === 1) return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">Tomorrow</span>;
  if (days <= 7) return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">In {days} days</span>;
  return <span className="text-xs bg-[#0038B8]/10 text-[#0038B8] px-2 py-1 rounded-full font-semibold">{format(new Date(date), "MMM d")}</span>;
}

function FeaturedCountdown({ date }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#0038B8]/10 flex flex-col justify-center items-center text-center h-full">
      <p className="text-[#001F6B]/50 text-xs uppercase tracking-widest mb-6 font-bold">Event Starts In</p>
      <div className="grid grid-cols-4 gap-3 w-full">
        {units.map(({ label, value }) => (
          <motion.div key={label}
            className="bg-[#F0F5FF] rounded-2xl p-4 flex flex-col items-center"
            animate={{ scale: label === "Seconds" ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: label === "Seconds" ? Infinity : 0 }}>
            <span className="text-[#0038B8] text-3xl font-bold font-mono">{pad(value)}</span>
            <span className="text-[#001F6B]/40 text-xs uppercase tracking-wider mt-1 font-semibold">{label}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-[#001F6B]/40 text-xs mt-6">Add to your calendar and do not miss out!</p>
    </div>
  );
}

function RSVPModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", guests: 1 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ height: "4px", background: "#0038B8" }} />
        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <h3 style={{ color: "#001F6B", fontSize: "20px", fontWeight: "bold", margin: 0 }}>RSVP for Event</h3>
              <p style={{ color: "#0038B8", fontSize: "14px", fontWeight: "600", margin: "4px 0 0 0" }}>{event.title}</p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "4px 0 0 0" }}>{format(new Date(event.date), "EEEE, MMMM d, yyyy")} at {event.time}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#9ca3af" }}>✕</button>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>✅</div>
              <h4 style={{ color: "#001F6B", fontWeight: "bold", fontSize: "20px", marginBottom: "8px" }}>RSVP Confirmed!</h4>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>We look forward to seeing you at {event.title}.</p>
              <div style={{ background: "#F0F5FF", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                <p style={{ color: "#001F6B", fontWeight: "600", fontSize: "14px", margin: 0 }}>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</p>
                <p style={{ color: "#0038B8", fontSize: "13px", margin: "4px 0 0 0" }}>{event.time} · {event.location}</p>
              </div>
              <button onClick={onClose} style={{ background: "#0038B8", color: "white", fontWeight: "bold", padding: "12px 24px", borderRadius: "50px", border: "none", cursor: "pointer" }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[["Full Name", "name", "text", "John Doe"], ["Email Address", "email", "email", "you@email.com"]].map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#001F6B", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required placeholder={placeholder}
                    style={{ width: "100%", border: "2px solid rgba(0,56,184,0.2)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "#001F6B", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", color: "#001F6B", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>Phone (optional)</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+254..."
                    style={{ width: "100%", border: "2px solid rgba(0,56,184,0.2)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "#001F6B", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#001F6B", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>Guests</label>
                  <input type="number" min="1" max="10" value={form.guests} onChange={e => setForm({...form, guests: e.target.value})}
                    style={{ width: "100%", border: "2px solid rgba(0,56,184,0.2)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "#001F6B", boxSizing: "border-box" }} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ background: loading ? "#93c5fd" : "#0038B8", color: "white", fontWeight: "bold", padding: "14px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px", marginTop: "8px" }}>
                {loading ? "Confirming..." : "Confirm RSVP"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function EventCard({ event, onRSVP, featured = false }) {
  const colors = categoryColors[event.category] || categoryColors.worship;
  const barColor = categoryBarColor[event.category] || "#0038B8";
  const past = isPast(new Date(event.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? "border-[#0038B8] ring-2 ring-[#0038B8]/20" : "border-gray-100"} ${past ? "opacity-60" : ""}`}
    >
      <div style={{ height: "3px", background: barColor }} />
      {featured && <div className="bg-[#0038B8] text-white text-xs font-bold px-4 py-1.5">⭐ Featured Event</div>}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${colors.bg} ${colors.text}`}>
            {event.category.replace("-", " ")}
          </span>
          <CountdownBadge date={event.date} />
        </div>
        <h3 className="text-[#001F6B] font-bold text-xl mb-2 leading-tight">{event.title}</h3>
        <p className="text-[#001F6B]/60 text-sm mb-5 line-clamp-2 leading-relaxed">{event.description}</p>
        <div className="flex flex-col gap-2.5 mb-6">
          {[
            { icon: Calendar, text: format(new Date(event.date), "EEEE, MMMM d, yyyy") },
            { icon: Clock, text: event.time },
            { icon: MapPin, text: event.location },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0038B8]/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[#0038B8]" />
              </div>
              <span className="text-[#001F6B]/70 text-sm">{text}</span>
            </div>
          ))}
        </div>
        {!past ? (
          <button onClick={() => onRSVP(event)}
            className="w-full bg-[#0038B8] hover:bg-[#001F6B] text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm">
            <Users size={16} /> RSVP for this Event
          </button>
        ) : (
          <div className="w-full bg-gray-100 text-gray-500 font-semibold py-3 rounded-2xl text-center text-sm">Event Passed</div>
        )}
      </div>
    </motion.div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    api.get("/events").then(res => setEvents(res.data.data || [])).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(events.map(e => e.category))];

  const filtered = events.filter(e => {
    const matchCategory = activeCategory === "all" || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
    const matchPast = showPast ? true : !isPast(new Date(e.date));
    return matchCategory && matchSearch && matchPast;
  });

  const upcoming = filtered.filter(e => !isPast(new Date(e.date)));
  const past = filtered.filter(e => isPast(new Date(e.date)));
  const featured = upcoming[0];

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Hero */}
      <div className="bg-[#0038B8] pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg width="500" height="500" viewBox="0 0 100 100">
            <polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">What is Coming Up</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-white/70 text-lg max-w-xl">Join us for worship, fellowship and community. All are welcome in the house of Elohim.</p>
            <div className="flex gap-6 mt-8">
              <div><p className="text-white text-2xl font-bold">{upcoming.length}</p><p className="text-white/60 text-xs uppercase tracking-wider">Upcoming</p></div>
              <div className="w-px bg-white/20" />
              <div><p className="text-white text-2xl font-bold">{categories.length - 1}</p><p className="text-white/60 text-xs uppercase tracking-wider">Categories</p></div>
              <div className="w-px bg-white/20" />
              <div><p className="text-white text-2xl font-bold">{events.length}</p><p className="text-white/60 text-xs uppercase tracking-wider">Total Events</p></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0038B8]/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
              className="w-full border-2 border-[#0038B8]/15 focus:border-[#0038B8] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none text-[#001F6B]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${activeCategory === cat ? "bg-[#0038B8] text-white" : "bg-gray-100 text-gray-600 hover:bg-[#0038B8]/10 hover:text-[#0038B8]"}`}>
                {cat === "all" ? "All Events" : cat.replace("-", " ")}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" checked={showPast} onChange={e => setShowPast(e.target.checked)} className="w-4 h-4" />
            <span className="text-[#001F6B]/60 text-xs font-semibold">Show past events</span>
          </label>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" />
            <p className="text-[#001F6B]/50 text-sm">Loading events...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Calendar size={56} className="text-[#0038B8]/20 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-2xl font-bold mb-2">No Events Found</h3>
            <p className="text-[#001F6B]/50 text-sm mb-6">{search ? "Try a different search term" : "Check back soon."}</p>
            {search && <button onClick={() => setSearch("")} className="bg-[#0038B8] text-white font-bold px-6 py-2 rounded-full text-sm">Clear Search</button>}
          </motion.div>
        ) : (
          <>
            {/* Featured + Live Countdown */}
            {featured && !search && activeCategory === "all" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <h2 className="text-[#001F6B] text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 bg-[#0038B8] inline-block rounded" /> Next Event
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Featured event card */}
                  <div className="bg-[#0038B8] rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                      <svg width="200" height="200" viewBox="0 0 100 100">
                        <polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="3"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full capitalize mb-4 inline-block">
                      {featured.category.replace("-", " ")}
                    </span>
                    <h2 className="text-3xl font-bold mb-3">{featured.title}</h2>
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">{featured.description}</p>
                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex items-center gap-2 text-white/80 text-sm"><Calendar size={14} /> {format(new Date(featured.date), "EEEE, MMMM d, yyyy")}</div>
                      <div className="flex items-center gap-2 text-white/80 text-sm"><Clock size={14} /> {featured.time}</div>
                      <div className="flex items-center gap-2 text-white/80 text-sm"><MapPin size={14} /> {featured.location}</div>
                    </div>
                    <button onClick={() => setSelectedEvent(featured)}
                      className="bg-white text-[#0038B8] font-bold py-3 px-6 rounded-2xl hover:bg-white/90 transition-all flex items-center gap-2">
                      <Users size={16} /> RSVP Now
                    </button>
                  </div>

                  {/* Live countdown */}
                  <FeaturedCountdown date={featured.date} />
                </div>
              </motion.div>
            )}

            {/* All Upcoming */}
            {upcoming.length > 0 && (
              <div className="mb-12">
                <h2 className="text-[#001F6B] text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-[#0038B8] inline-block rounded" />
                  All Upcoming Events
                  <span className="text-sm font-normal text-[#001F6B]/40 ml-2">({upcoming.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((event, i) => (
                    <EventCard key={event._id} event={event} onRSVP={setSelectedEvent} featured={i === 0 && !search && activeCategory === "all"} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {showPast && past.length > 0 && (
              <div>
                <h2 className="text-[#001F6B] text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-gray-300 inline-block rounded" />
                  Past Events
                  <span className="text-sm font-normal text-[#001F6B]/40 ml-2">({past.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map(event => <EventCard key={event._id} event={event} onRSVP={setSelectedEvent} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && <RSVPModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  );
}
