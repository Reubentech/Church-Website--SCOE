import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function EventCard({ event }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#0038B8]/10 hover:shadow-lg transition-all duration-300">
      <div className="h-1.5 bg-[#0038B8]" />
      <div className="p-6">
        <span className="inline-block bg-[#0038B8]/10 text-[#0038B8] text-xs font-bold px-3 py-1 rounded-full mb-3 capitalize">{event.category}</span>
        <h3 className="text-[#001F6B] font-bold text-lg mb-2">{event.title}</h3>
        <p className="text-[#001F6B]/60 text-sm mb-4 line-clamp-2">{event.description}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#001F6B]/50 text-sm"><Calendar size={14} className="text-[#0038B8]" /><span>{format(new Date(event.date), "MMMM d, yyyy")}</span></div>
          <div className="flex items-center gap-2 text-[#001F6B]/50 text-sm"><Clock size={14} className="text-[#0038B8]" /><span>{event.time}</span></div>
          <div className="flex items-center gap-2 text-[#001F6B]/50 text-sm"><MapPin size={14} className="text-[#0038B8]" /><span>{event.location}</span></div>
        </div>
      </div>
    </motion.div>
  );
}
