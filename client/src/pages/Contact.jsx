import { useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/contact", form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">Reach Out</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold">Contact Us</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Info */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex gap-1 mb-6">
            <div className="w-16 h-1 bg-[#0038B8]" />
            <div className="w-8 h-1 bg-[#0038B8]/40" />
          </div>
          <h2 className="text-[#001F6B] text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-[#001F6B]/60 leading-relaxed mb-10">
            We would love to hear from you. Whether you have a question about our services, want to join us, or simply want to connect — reach out and we will respond promptly.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { icon: MapPin, label: "Location", value: "Nyahururu, Kenya" },
              { icon: Mail, label: "Email", value: "sabbathtarianchurchofelohim@gmail.com" },
              { icon: Phone, label: "Phone", value: "+254 722 867 734" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0038B8] rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[#001F6B]/40 text-xs font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-[#001F6B] font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          {success ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <CheckCircle size={64} className="text-[#0038B8] mb-4" />
              <h3 className="text-[#001F6B] text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-[#001F6B]/60 mb-6">Thank you for reaching out. We will get back to you soon.</p>
              <button onClick={() => setSuccess(false)} className="bg-[#0038B8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#001F6B] transition-colors">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border-2 border-[#0038B8]/10 rounded-3xl p-8 shadow-sm flex flex-col gap-5">
              <div className="h-1 bg-[#0038B8] rounded-full -mt-8 -mx-8 mb-3" />
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Your Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#001F6B]" />
                </div>
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#001F6B]" />
                </div>
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Write your message here..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#001F6B] resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="bg-[#0038B8] hover:bg-[#001F6B] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
