import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api, { SERVER_URL } from "../../utils/api";
import { Plus, Trash2, ArrowLeft, Image } from "lucide-react";

export default function ManageGallery() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "other" });
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchImages = () => api.get("/gallery/all").then(res => setImages(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchImages(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) { alert("Please select an image"); return; }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("image", file);
      await api.post("/gallery", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ title: "", description: "", category: "other" }); setFile(null); setShowForm(false);
      fetchImages();
    } catch (err) { alert(err.response?.data?.message || "Upload failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this image?")) return;
    await api.delete(`/gallery/${id}`); fetchImages();
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Manage Gallery</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90 transition-all">
            <Plus size={18} /> Upload Photo
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">Upload New Photo</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Photo title"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]">
                  {["worship","events","community","baptism","other"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Image File</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required
                  className="w-full border-2 border-[#0038B8]/20 rounded-xl px-4 py-3 text-sm text-[#001F6B]" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Uploading..." : "Upload Photo"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-20">
            <Image size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="relative group rounded-2xl overflow-hidden shadow-md aspect-square border border-[#0038B8]/10">
                <img src={`${SERVER_URL}${img.imageUrl}`} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#001F6B]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white font-bold text-sm mb-3">{img.title}</p>
                    <button onClick={() => handleDelete(img._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
