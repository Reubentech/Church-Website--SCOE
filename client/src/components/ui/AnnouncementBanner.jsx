import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import api from "../../utils/api";

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    api.get("/announcements").then(res => setAnnouncements(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => setCurrent(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (dismissed || announcements.length === 0) return null;

  const ann = announcements[current];
  const colors = { info: "bg-[#0038B8]", warning: "bg-amber-500", success: "bg-green-600" };

  return (
    <AnimatePresence>
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
        className={`${colors[ann.type]} text-white relative z-40`}>
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Bell size={14} className="shrink-0" />
            <p className="text-sm font-medium truncate">{ann.message}</p>
            {ann.link && (
              <a href={ann.link} target="_blank" rel="noreferrer"
                className="text-white/80 hover:text-white underline text-sm shrink-0">{ann.linkText || "Learn more"}</a>
            )}
          </div>
          {announcements.length > 1 && (
            <div className="flex gap-1 shrink-0">
              {announcements.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          )}
          <button onClick={() => setDismissed(true)} className="text-white/70 hover:text-white shrink-0">
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
