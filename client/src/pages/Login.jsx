import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";

function StarOfDavid({ size = 60, color = "#0038B8" }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const p1 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  const p2 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 + 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><polygon points={p1} fill="none" stroke={color} strokeWidth={size * 0.05} /><polygon points={p2} fill="none" stroke={color} strokeWidth={size * 0.05} /></svg>;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#0038B8]" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0038B8]" />
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <StarOfDavid size={500} color="#0038B8" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl border border-[#0038B8]/10 w-full max-w-md overflow-hidden">
        <div className="h-2 bg-[#0038B8]" />
        <div className="p-10">
          <div className="flex justify-center mb-6"><StarOfDavid size={60} color="#0038B8" /></div>
          <h1 className="text-[#001F6B] text-2xl font-bold text-center mb-1">Admin Login</h1>
          <p className="text-[#001F6B]/50 text-sm text-center mb-8">Sabbathtarian Church of Elohim</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-[#001F6B] text-sm font-semibold mb-2 block">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="admin@church.org"
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#001F6B]" />
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-semibold mb-2 block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-[#001F6B] pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0038B8]/50 hover:text-[#0038B8]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="bg-[#0038B8] hover:bg-[#001F6B] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <p className="text-center text-[#001F6B]/40 text-xs mt-6">
            <Link to="/" className="hover:text-[#0038B8] transition-colors">← Back to Homepage</Link>
          </p>
        </div>
        <div className="h-2 bg-[#0038B8]" />
      </motion.div>
    </div>
  );
}
