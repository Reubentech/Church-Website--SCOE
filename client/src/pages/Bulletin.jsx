import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { format } from "date-fns";
import api from "../utils/api";

function BulletinCard({ bulletin }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden border border-[#0038B8]/10 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-1.5 bg-[#0038B8]" />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#0038B8]/10 rounded-lg flex items-center justify-center">
                <FileText size={14} className="text-[#0038B8]" />
              </div>
              <span className="text-[#0038B8] text-xs font-bold uppercase tracking-wider">{bulletin.week}</span>
            </div>
            <h3 className="text-[#001F6B] font-bold text-xl mb-1">{bulletin.title}</h3>
            <div className="flex items-center gap-2 text-[#001F6B]/40 text-xs">
              <Calendar size={12} />
              <span>{format(new Date(bulletin.date), "EEEE, MMMM d, yyyy")}</span>
            </div>
          </div>
          <button onClick={() => setOpen(!open)}
            className="w-10 h-10 bg-[#0038B8]/10 hover:bg-[#0038B8] text-[#0038B8] hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0 ml-4">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-[#0038B8]/10">

              {/* Welcome message */}
              <p className="text-[#001F6B]/70 leading-relaxed mb-6 italic">{bulletin.content}</p>

              {/* Scripture */}
              {bulletin.scripture && (
                <div className="bg-[#F0F5FF] rounded-2xl p-5 mb-6 border-l-4 border-[#0038B8]">
                  <p className="text-[#0038B8] text-xs font-bold uppercase tracking-wider mb-2">Scripture of the Week</p>
                  <p className="text-[#001F6B] text-sm italic leading-relaxed">{bulletin.scripture}</p>
                </div>
              )}

              {/* Announcements */}
              {bulletin.announcements?.length > 0 && (
                <div>
                  <h4 className="text-[#001F6B] font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-6 h-1 bg-[#0038B8] inline-block rounded" />
                    Announcements
                  </h4>
                  <div className="flex flex-col gap-3">
                    {bulletin.announcements.map((ann, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#0038B8] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-[#001F6B]/70 text-sm leading-relaxed">{ann}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Bulletin() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bulletin").then(res => setBulletins(res.data.data || [])).catch(() => setBulletins([])).finally(() => setLoading(false));
  }, []);

  const latest = bulletins[0];

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">Weekly Publication</p>
            <h1 className="text-white text-5xl font-bold mb-3">Church Bulletin</h1>
            <p className="text-white/70">Weekly announcements, scripture and news from Sabbathtarian Church of Elohim.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : bulletins.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="text-[#0038B8]/20 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-xl font-bold mb-2">No Bulletins Yet</h3>
            <p className="text-[#001F6B]/50 text-sm">The weekly bulletin will appear here.</p>
          </div>
        ) : (
          <>
            {/* Latest bulletin highlighted */}
            {latest && (
              <div className="mb-10">
                <h2 className="text-[#001F6B] text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 bg-[#0038B8] inline-block rounded" />
                  This Week
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold ml-2">Latest</span>
                </h2>
                <div className="bg-[#0038B8] rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <svg width="200" height="200" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="3"/></svg>
                  </div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">{latest.week}</p>
                  <h2 className="text-2xl font-bold mb-3">{latest.title}</h2>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">{latest.content}</p>
                  {latest.scripture && (
                    <div className="bg-white/15 rounded-2xl p-4 mb-4">
                      <p className="text-white/60 text-xs font-bold uppercase mb-1">Scripture</p>
                      <p className="text-white text-sm italic">{latest.scripture}</p>
                    </div>
                  )}
                  <p className="text-white/50 text-xs">{format(new Date(latest.date), "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>
            )}

            {/* All bulletins */}
            <h2 className="text-[#001F6B] text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#0038B8] inline-block rounded" />
              All Bulletins
            </h2>
            <div className="flex flex-col gap-4">
              {bulletins.map(bulletin => <BulletinCard key={bulletin.id} bulletin={bulletin} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
