import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import api from "../utils/api";

function StarOfDavid() {
  const cx = 30, cy = 30, r = 22;
  const p1 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  const p2 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 + 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  return <svg width="60" height="60" viewBox="0 0 60 60"><polygon points={p1} fill="none" stroke="#0038B8" strokeWidth="3"/><polygon points={p2} fill="none" stroke="#0038B8" strokeWidth="3"/></svg>;
}

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#0038B8]" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0038B8]" />
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="#0038B8" strokeWidth="2"/></svg>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl border border-[#0038B8]/10 w-full max-w-md overflow-hidden">
        <div className="h-2 bg-[#0038B8]" />
        <div className="p-10">
          <div className="flex justify-center mb-6"><StarOfDavid /></div>
          <h1 className="text-[#001F6B] text-2xl font-bold text-center mb-1">Create Account</h1>
          <p className="text-[#001F6B]/50 text-sm text-center mb-8">Join the Sabbathtarian Church of Elohim</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com"
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="Min. 6 characters"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0038B8]/50 hover:text-[#0038B8]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required placeholder="Repeat password"
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-[#0038B8] hover:bg-[#001F6B] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-[#001F6B]/50 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-[#0038B8] font-bold hover:underline">Sign In</Link>
          </p>
          <p className="text-center mt-2"><Link to="/" className="text-[#001F6B]/40 text-xs hover:text-[#0038B8] transition-colors">Back to Homepage</Link></p>
        </div>
        <div className="h-2 bg-[#0038B8]" />
      </motion.div>
    </div>
  );
}
