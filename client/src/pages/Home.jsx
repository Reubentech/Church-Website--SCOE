import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Heart, Star } from "lucide-react";
import SabbathCountdown from "../components/ui/SabbathCountdown";
import LiveStreamSection from "../components/ui/LiveStreamSection";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } };

function StarOfDavid({ size = 80, color = "#03287e", opacity = 1 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const p1 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  const p2 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 + 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <polygon points={p1} fill="none" stroke={color} strokeWidth={size * 0.05} />
      <polygon points={p2} fill="none" stroke={color} strokeWidth={size * 0.05} />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 bg-[#03287e]" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#03287e]" />
        <div className="absolute top-20 left-0 right-0 h-px bg-[#03287e]/20" />
        <div className="absolute bottom-20 left-0 right-0 h-px bg-[#03287e]/20" />
        <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none"><StarOfDavid size={200} color="#03287e" /></div>
        <div className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none"><StarOfDavid size={200} color="#03287e" /></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
            className="flex justify-center mb-8"
          >
            <StarOfDavid size={100} color="#03287e" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#03287e] text-xs font-bold tracking-[0.4em] uppercase mb-4"
          >
            Welcome to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-[#001F6B] text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            Sabbathtarian Church of Elohim
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[#001F6B]/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Rooted in Scripture. Devoted to Truth. Observing the Sacred Sabbath as ordained by Elohim from the beginning of creation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/events" className="bg-[#0038B8] hover:bg-[#001F6B] text-white font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 justify-center shadow-lg">
              Upcoming Events <ArrowRight size={18} />
            </Link>
            <Link to="/sermons" className="border-2 border-[#0038B8] text-[#0038B8] hover:bg-[#0038B8] hover:text-white px-8 py-4 rounded-full transition-all flex items-center gap-2 justify-center">
              Listen to Sermons <BookOpen size={18} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#0038B8]/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-[#0038B8] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* SABBATH COUNTDOWN */}
      <SabbathCountdown />

      {/* ABOUT */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="flex gap-1 mb-6">
              <div className="w-16 h-1 bg-[#03287e]" />
              <div className="w-8 h-1 bg-[#03287e]/40" />
              <div className="w-4 h-1 bg-[#03287e]/20" />
            </div>
            <p className="text-[#03287e] text-xs font-bold tracking-widest uppercase mb-3">Who We Are</p>
            <h2 className="text-[#001F6B] text-4xl font-bold mb-6">About Our Church</h2>
            <p className="text-[#001F6B]/70 leading-relaxed mb-4">
              Sabbathtarian Church of Elohim is a faith-driven community committed to restoring the truth of Elohim’s word and honoring His commandments. Our foundation is built on the teachings of the Bible, which we uphold as the final authority in all matters of faith and life.
We believe in the sacredness of the seventh-day ‘Sabbath’, observed from Friday evening to Saturday evening, as established at creation and affirmed throughout scripture. Following the example of Yahshua Messiah, we set apart this day for rest, worship, and fellowship with God and one another.
Our mission is to guide individuals into a deeper relationship with God through truth, obedience, and spiritual growth. We emphasize not just belief, but a transformed way of life, one that reflects faith, discipline, and devotion.
At Sabbathtarian Church of Elohim, we are more than a place of worship. We are a family. We support one another, grow together in faith, and prepare our hearts for the promised return of the Messiah. Through worship services, Bible study, and community outreach, we seek to live out God’s purpose in a practical and meaningful way.
We welcome all who are seeking truth, purpose, and a closer walk with Elohim.

            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#03287e] text-white px-6 py-3 rounded-full hover:bg-[#001F6B] transition-colors shadow-md">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div {...fadeUp}>
            <div className="relative bg-white border-2 border-[#03287e]/20 rounded-3xl overflow-hidden shadow-xl">
              <div className="h-6 bg-[#03287e]" />
              <div className="p-10 text-center">
                <div className="flex justify-center mb-6"><StarOfDavid size={70} color="#03287e" /></div>
                <blockquote className="text-[#001F6B] italic text-lg leading-relaxed font-medium">
                  "Remember the Sabbath day, to keep it holy. Six days you shall labor and do all your work, but the seventh day is a Sabbath to Elohim your God."
                </blockquote>
                <p className="text-[#03287e] text-sm mt-6 font-bold">Exodus 20:8-10</p>
              </div>
              <div className="h-6 bg-[#03287e]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24 px-6 bg-[#F0F5FF]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="flex justify-center mb-4 opacity-20"><StarOfDavid size={60} color="#03287e" /></div>
            <p className="text-[#03287e] text-xs font-bold tracking-widest uppercase mb-3">Our Purpose</p>
            <h2 className="text-[#001F6B] text-4xl font-bold">Mission & Vision</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Our Mission", text: "Our mission is to lead people into faith, truth, and spiritual growth by teaching the word of Elohim, keeping the Sabbath holy, and building a strong, supportive community in the Messiah." },
              { icon: Star, title: "Our Vision", text: "Our vision is to build a spiritually grounded community that lives in obedience to Elohim, upholds the Sabbath, and reflects the teachings of Yahshua Messiah in everyday life." },
              { icon: Heart, title: "Our Values", text: "We are committed to the truth of God’s word as revealed in the Bible, holding firmly to it without compromise. We believe in living out Elohim’s commandments, including honoring the Sabbath, as an expression of our faith in Yahshua Messiah. We trust in Elohim’s promises and rely on Him in every aspect of our lives, striving to grow in faith and spiritual discipline. We pursue holiness by living a life set apart for Elohim, while showing love, compassion, and unity within our community. Through sincere worship and a heart for service, we seek to honor Elohim and reflect His love through our actions." }
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-[#03287e]/10 relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#03287e]" />
                <div className="w-14 h-14 bg-[#03287e] rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-[#001F6B] text-xl font-bold mb-3">{title}</h3>
                <p className="text-[#001F6B]/60 leading-relaxed text-sm">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE STREAM */}
      <LiveStreamSection />

      {/* CALL TO ACTION */}
      <section className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#03287e]" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#03287e]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <StarOfDavid size={400} color="#03287e" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp}>
            <p className="text-[#03287e] text-xs font-bold tracking-widest uppercase mb-3">Be Part of Something Sacred</p>
            <h2 className="text-[#001F6B] text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
            <p className="text-[#001F6B]/60 text-lg mb-10 leading-relaxed">
              Whether you are new to the faith or a seasoned believer, there is a place for you here. Come worship with us this Sabbath.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="bg-[#03287e] hover:bg-[#001F6B] text-white font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 justify-center shadow-lg">
                View Events <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="border-2 border-[#03287e] text-[#03287e] hover:bg-[#03287e] hover:text-white px-8 py-4 rounded-full transition-all flex items-center gap-2 justify-center">
                Contact Us <Users size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
