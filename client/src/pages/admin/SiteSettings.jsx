import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

const Field = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div>
    <label className="text-[#001F6B] text-sm font-bold mb-2 block">{label}</label>
    {type === "textarea" ? (
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3}
        className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
    )}
  </div>
);

export default function SiteSettings() {
  const [form, setForm] = useState({
    churchName: "", tagline: "", address: "", phone: "", email: "",
    facebook: "", youtube: "", twitter: "", instagram: "",
    livestreamUrl: "", isLive: false, welcomeMessage: "", aboutText: ""
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then(res => setForm(res.data.data)).catch(() => {});
  }, []);

  const handleChange = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/settings", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert("Failed to save settings"); }
    finally { setLoading(false); }
  };

  const sections = [
    {
      title: "Church Information",
      fields: [
        { label: "Church Name", name: "churchName", placeholder: "Sabbathtarian Church of Elohim" },
        { label: "Tagline", name: "tagline", placeholder: "Rooted in Scripture..." },
        { label: "Address", name: "address", placeholder: "Nairobi, Kenya" },
        { label: "Phone", name: "phone", placeholder: "+254 700 000 000" },
        { label: "Email", name: "email", placeholder: "admin@church.org" },
      ]
    },
    {
      title: "Social Media Links",
      fields: [
        { label: "Facebook URL", name: "facebook", placeholder: "https://facebook.com/..." },
        { label: "YouTube URL", name: "youtube", placeholder: "https://youtube.com/..." },
        { label: "Twitter URL", name: "twitter", placeholder: "https://twitter.com/..." },
        { label: "Instagram URL", name: "instagram", placeholder: "https://instagram.com/..." },
      ]
    },
    {
      title: "Live Stream",
      fields: [
        { label: "Live Stream URL (YouTube/Zoom embed)", name: "livestreamUrl", placeholder: "https://youtube.com/embed/..." },
      ]
    },
    {
      title: "Content",
      fields: [
        { label: "Welcome Message", name: "welcomeMessage", placeholder: "Welcome to our church!", type: "textarea" },
        { label: "About Text", name: "aboutText", placeholder: "About the church...", type: "textarea" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Site Settings</h1>
            <p className="text-white/60 text-sm mt-1">Manage your church website settings</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              <CheckCircle size={16} /> Saved!
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Live toggle */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#001F6B] font-bold text-lg">Live Stream Status</h3>
                <p className="text-[#001F6B]/50 text-sm">Show "LIVE" badge on homepage when streaming</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isLive" checked={form.isLive} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0038B8]"></div>
              </label>
            </div>
          </div>

          {sections.map(({ title, fields }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
              <h3 className="text-[#001F6B] font-bold text-lg mb-6">{title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fields.map(f => (
                  <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                    <Field {...f} value={form[f.name] || ""} onChange={handleChange} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <button type="submit" disabled={loading}
            className="bg-[#0038B8] hover:bg-[#001F6B] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg">
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> Save All Settings</>}
          </button>
        </form>
      </div>
    </div>
  );
}
