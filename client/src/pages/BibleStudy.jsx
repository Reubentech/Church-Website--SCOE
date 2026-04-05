import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import api from "../utils/api";

function StudyCard({ study }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-[#0038B8]/10 overflow-hidden">
      <div className="h-1 bg-[#0038B8]" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-3 py-1 rounded-full mb-3 inline-block">{study.week}</span>
            <h3 className="text-[#001F6B] font-bold text-lg mb-1">{study.title}</h3>
            <p className="text-[#0038B8] text-sm font-semibold mb-1">{study.scripture}</p>
            <p className="text-[#001F6B]/50 text-xs">By {study.author}</p>
          </div>
          <button onClick={() => setOpen(!open)} className="text-[#0038B8] hover:bg-[#0038B8]/10 p-2 rounded-xl transition-colors shrink-0">
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-[#0038B8]/10">
            <p className="text-[#001F6B]/70 leading-relaxed text-sm whitespace-pre-line">{study.content}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function BibleStudy() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bible-studies").then(res => setStudies(res.data.data || [])).catch(() => setStudies([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">Study the Word</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold">Weekly Bible Study</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : studies.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-xl font-bold mb-2">No Studies Yet</h3>
            <p className="text-[#001F6B]/50 text-sm">Bible study notes will be posted weekly.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {studies.map(study => <StudyCard key={study._id} study={study} />)}
          </div>
        )}
      </div>
    </div>
  );
}
