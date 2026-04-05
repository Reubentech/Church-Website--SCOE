import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, CheckCircle, Lock } from "lucide-react";
import api from "../utils/api";

export default function PrayerRequest() {
  const [form, setForm] = useState({ name: "", email: "", request: "", isAnonymous: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/prayer-requests", form);
      setSuccess(true);
      setForm({ name: "", email: "", request: "", isAnonymous: false });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">We Pray With You</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold">Prayer Requests</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 bg-[#0038B8] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-white" />
          </div>
          <h2 className="text-[#001F6B] text-2xl font-bold mb-3">Share Your Prayer Need</h2>
          <p className="text-[#001F6B]/60 leading-relaxed">
            Our congregation prays together. Submit your prayer request and our prayer team will lift you up before Elohim.
          </p>
        </motion.div>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-[#F0F5FF] rounded-3xl border border-[#0038B8]/10">
            <CheckCircle size={64} className="text-[#0038B8] mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-2xl font-bold mb-2">Prayer Request Submitted</h3>
            <p className="text-[#001F6B]/60 mb-6">Our prayer team will be praying for you. Elohim hears every prayer.</p>
            <button onClick={() => setSuccess(false)} className="bg-[#0038B8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#001F6B] transition-colors">
              Submit Another Request
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#0038B8]/10 rounded-3xl p-8 shadow-sm relative overflow-hidden flex flex-col gap-5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <div className="flex items-center gap-3 p-4 bg-[#F0F5FF] rounded-xl">
              <input type="checkbox" name="isAnonymous" id="anon" checked={form.isAnonymous} onChange={handleChange} className="w-4 h-4" />
              <label htmlFor="anon" className="flex items-center gap-2 text-[#001F6B] text-sm font-semibold cursor-pointer">
                <Lock size={14} className="text-[#0038B8]" /> Submit Anonymously
              </label>
            </div>

            {!form.isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Your Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required={!form.isAnonymous} placeholder="John Doe"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Email (optional)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Your Prayer Request</label>
              <textarea name="request" value={form.request} onChange={handleChange} required rows={6}
                placeholder="Share your prayer need here. All requests are treated with confidentiality and care..."
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="bg-[#0038B8] hover:bg-[#001F6B] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Heart size={18} /> Submit Prayer Request</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
