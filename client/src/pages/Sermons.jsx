import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import SermonCard from "../components/ui/SermonCard";
import { Headphones, Search } from "lucide-react";

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [speaker, setSpeaker] = useState("all");

  useEffect(() => {
    api.get("/sermons").then(res => setSermons(res.data.data || [])).catch(() => setSermons([])).finally(() => setLoading(false));
  }, []);

  const speakers = ["all", ...new Set(sermons.map(s => s.speaker))];

  const filtered = sermons.filter(s => {
    const matchType = filter === "all" || s.type === filter;
    const matchSpeaker = speaker === "all" || s.speaker === speaker;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speaker.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSpeaker && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">The Word of Elohim</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">Sermons & Teachings</h1>

            {/* Search */}
            <div className="relative max-w-md mb-6">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sermons, speakers..."
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-full pl-10 pr-5 py-3 text-sm outline-none focus:bg-white/30 transition-all" />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex gap-2">
                {["all", "video", "audio", "pdf"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all capitalize ${filter === f ? "bg-white text-[#0038B8]" : "bg-white/20 text-white hover:bg-white/30"}`}>
                    {f === "all" ? "All Types" : f}
                  </button>
                ))}
              </div>
              {speakers.length > 1 && (
                <select value={speaker} onChange={e => setSpeaker(e.target.value)}
                  className="bg-white/20 border border-white/30 text-white rounded-full px-4 py-2 text-sm outline-none">
                  {speakers.map(s => <option key={s} value={s} className="text-[#001F6B]">{s === "all" ? "All Speakers" : s}</option>)}
                </select>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Headphones size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-xl font-bold mb-2">{search ? "No Results Found" : "No Sermons Yet"}</h3>
            <p className="text-[#001F6B]/50 text-sm">{search ? "Try a different search term" : "Sermons will be uploaded soon."}</p>
          </motion.div>
        ) : (
          <>
            <p className="text-[#001F6B]/50 text-sm mb-6">{filtered.length} sermon{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(sermon => <SermonCard key={sermon.id} sermon={sermon} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
