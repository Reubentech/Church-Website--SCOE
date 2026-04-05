import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function getNextSabbath() {
  const now = new Date();
  const day = now.getDay(), hours = now.getHours();
  let target = new Date(now);
  const isSabbath = (day === 5 && hours >= 18) || (day === 6 && hours < 18);
  if (isSabbath) { target.setDate(now.getDate() + (6 - day)); target.setHours(18, 0, 0, 0); return { target, isSabbath: true }; }
  let daysUntilFriday = (5 - day + 7) % 7 || 7;
  if (day === 5 && hours < 18) daysUntilFriday = 0;
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(18, 0, 0, 0);
  return { target, isSabbath: false };
}

function pad(n) { return String(n).padStart(2, "0"); }

export default function SabbathCountdown() {
  const [timeLeft, setTimeLeft] = useState({});
  const [isSabbath, setIsSabbath] = useState(false);

  useEffect(() => {
    const tick = () => {
      const { target, isSabbath } = getNextSabbath();
      setIsSabbath(isSabbath);
      const diff = target - new Date();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [{ label: "Days", value: timeLeft.days }, { label: "Hours", value: timeLeft.hours }, { label: "Minutes", value: timeLeft.minutes }, { label: "Seconds", value: timeLeft.seconds }];

  return (
    <section className="bg-[#0038B8] py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-3">{isSabbath ? "The Sabbath is Now" : "Sabbath Begins In"}</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">{isSabbath ? "Shabbat Shalom!" : "Preparing for the Holy Sabbath"}</h2>
          <p className="text-white/50 text-sm mb-12">{isSabbath ? "Sabbath ends Saturday at 6:00 PM" : "Friday 6:00 PM to Saturday 6:00 PM"}</p>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {units.map(({ label, value }) => (
              <motion.div key={label} className="bg-white rounded-2xl p-6 shadow-lg" whileHover={{ scale: 1.05 }}>
                <div className="text-[#0038B8] text-4xl md:text-5xl font-bold font-mono">{pad(value ?? 0)}</div>
                <div className="text-[#0038B8]/50 text-xs mt-2 uppercase tracking-wider font-semibold">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
