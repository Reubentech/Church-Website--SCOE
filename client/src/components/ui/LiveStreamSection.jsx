import { motion } from "framer-motion";
import { Play, Radio } from "lucide-react";

export default function LiveStreamSection({ streamUrl = "", isLive = false }) {
  return (
    <section className="py-20 px-6 bg-[#F0F5FF]">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            {isLive && <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"><Radio size={10} /> LIVE</span>}
          </div>
          <p className="text-[#0038B8] text-xs font-bold tracking-widest uppercase mb-3">Join Us Online</p>
          <h2 className="text-[#001F6B] text-3xl md:text-4xl font-bold mb-4">Live Stream & Broadcasts</h2>
          <p className="text-[#001F6B]/60 text-sm max-w-xl mx-auto">
            Can not make it in person? Join our live Sabbath services online every Friday evening and Saturday morning.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#0038B8]/10">
          <div className="h-2 bg-[#0038B8]" />
          {streamUrl ? (
            <div className="aspect-video">
              <iframe src={streamUrl} className="w-full h-full" allowFullScreen title="Live Stream" />
            </div>
          ) : (
            <div className="aspect-video bg-[#001F6B] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Play size={36} className="text-white ml-1" />
              </div>
              <p className="text-white font-bold text-lg mb-2">No Live Stream Currently</p>
              <p className="text-white/50 text-sm">Join us every Friday at 6:00 PM for Sabbath service</p>
            </div>
          )}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { day: "Friday", time: "6:00 PM", label: "Sabbath Opening" },
              { day: "Saturday", time: "10:00 AM", label: "Morning Worship" },
              { day: "Saturday", time: "6:00 PM", label: "Sabbath Closing" },
            ].map(({ day, time, label }) => (
              <div key={label} className="text-center p-4 bg-[#F0F5FF] rounded-2xl">
                <p className="text-[#0038B8] font-bold text-sm">{day}</p>
                <p className="text-[#001F6B] text-xl font-bold">{time}</p>
                <p className="text-[#001F6B]/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
