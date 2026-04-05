import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import api from "../../utils/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/newsletter/subscribe", { email, name });
      setSuccess(true);
      setEmail(""); setName("");
    } catch (err) {
      setError(err.response?.data?.message || "Subscription failed");
    } finally { setLoading(false); }
  };

  return (
    <section className="bg-[#0038B8] py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 100 100">
          <polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Mail size={24} className="text-white" />
            </div>
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">Stay Connected</h2>
          <p className="text-white/70 text-sm mb-8">Subscribe to receive updates, sermons, and event announcements directly in your inbox.</p>

          {success ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={48} className="text-white" />
              <p className="text-white font-bold text-lg">You are subscribed!</p>
              <p className="text-white/70 text-sm">Thank you for joining our community.</p>
              <button onClick={() => setSuccess(false)} className="text-white/60 hover:text-white text-sm underline">Subscribe another email</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)"
                className="flex-1 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-full px-5 py-3 text-sm outline-none focus:bg-white/30 transition-all" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Your email address"
                className="flex-1 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-full px-5 py-3 text-sm outline-none focus:bg-white/30 transition-all" />
              <button type="submit" disabled={loading}
                className="bg-white text-[#0038B8] font-bold px-6 py-3 rounded-full hover:bg-white/90 transition-all disabled:opacity-60 shrink-0">
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {error && <p className="text-red-200 text-sm mt-3">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
}
