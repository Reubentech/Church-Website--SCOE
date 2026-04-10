import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, BookOpen, Upload, Video, Music, FileText } from "lucide-react";

const empty = { title: "", description: "", speaker: "", date: "", type: "video", videoLink: "", isPremium: false, price: 0 };

export default function ManageSermons() {
  const [sermons, setSermons] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchSermons = () => api.get("/sermons/all").then(res => setSermons(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchSermons(); }, []);

  const handleChange = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    if (e.target.name === "type") setFile(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("file", file);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: e => setUploadProgress(Math.round((e.loaded / e.total) * 100)),
      };
      if (editing) {
        await api.put(`/sermons/${editing}`, data, config);
      } else {
        await api.post("/sermons", data, config);
      }
      setForm(empty); setEditing(null); setShowForm(false); setFile(null); setUploadProgress(0);
      fetchSermons();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving sermon");
    } finally { setLoading(false); }
  };

  const handleEdit = s => {
    setForm({
      title: s.title, description: s.description, speaker: s.speaker,
      date: s.date?.slice(0, 10), type: s.type,
      videoLink: s.videoLink || "", isPremium: s.isPremium, price: s.price
    });
    setEditing(s.id); setShowForm(true); setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async id => {
    if (!confirm("Delete this sermon?")) return;
    await api.delete(`/sermons/${id}`);
    fetchSermons();
  };

  const typeIcon = { video: <Video size={14} />, audio: <Music size={14} />, pdf: <FileText size={14} /> };
  const acceptMap = { video: "video/mp4,video/mov,video/avi,video/*", audio: ".mp3,.wav,.m4a,.ogg,audio/*", pdf: ".pdf" };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Manage Sermons</h1>
            <p className="text-white/60 text-sm mt-1">{sermons.length} sermons · Upload video, audio or PDF</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); setFile(null); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90">
            <Plus size={18} /> Add Sermon
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit Sermon" : "Add New Sermon"}</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Sermon Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. The Sacred Sabbath"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>

              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Speaker *</label>
                <input name="speaker" value={form.speaker} onChange={handleChange} required placeholder="e.g. Pastor James Kariuki"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>

              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                  placeholder="Brief description of this sermon..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>

              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>

              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Media Type *</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]">
                  <option value="video">🎥 Video</option>
                  <option value="audio">🎵 Audio</option>
                  <option value="pdf">📄 PDF Document</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">
                  Upload {form.type === "video" ? "Video" : form.type === "audio" ? "Audio" : "PDF"} File
                  {editing && <span className="text-[#001F6B]/40 font-normal ml-2">(leave empty to keep existing file)</span>}
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${file ? "border-[#0038B8] bg-[#0038B8]/5" : "border-[#0038B8]/30 hover:border-[#0038B8]/60"}`}>
                  <input type="file" id="sermon-file" onChange={e => setFile(e.target.files[0])} accept={acceptMap[form.type]} className="hidden" />
                  <label htmlFor="sermon-file" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-[#0038B8]/10 rounded-full flex items-center justify-center">
                      <Upload size={22} className="text-[#0038B8]" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-[#001F6B] font-bold text-sm">{file.name}</p>
                        <p className="text-[#001F6B]/50 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB · Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[#001F6B] font-semibold text-sm">Click to upload {form.type === "video" ? "video" : form.type === "audio" ? "audio" : "PDF"}</p>
                        <p className="text-[#001F6B]/40 text-xs mt-1">
                          {form.type === "video" && "MP4, MOV, AVI · up to 500MB"}
                          {form.type === "audio" && "MP3, WAV, M4A, OGG · up to 500MB"}
                          {form.type === "pdf" && "PDF files only"}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {loading && uploadProgress > 0 && (
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#001F6B] text-sm font-bold">Uploading to Cloudinary...</span>
                    <span className="text-[#0038B8] text-sm font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#0038B8]/10 rounded-full h-2">
                    <div className="bg-[#0038B8] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input type="checkbox" name="isPremium" checked={form.isPremium} onChange={handleChange} id="premium" className="w-4 h-4" />
                <label htmlFor="premium" className="text-[#001F6B] text-sm font-bold cursor-pointer">Premium Content (M-Pesa required)</label>
              </div>

              {form.isPremium && (
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">Price (KES)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} min="0"
                    className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
                </div>
              )}

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60 flex items-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : "Saving..."}</>
                  ) : (
                    <>{editing ? "Update Sermon" : "Publish Sermon"}</>
                  )}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setFile(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl hover:border-[#0038B8] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {sermons.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50 text-lg font-semibold mb-2">No sermons yet</p>
            <p className="text-[#001F6B]/40 text-sm">Click "Add Sermon" to upload your first video, audio or PDF.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sermons.map(s => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-2 py-1 rounded-full uppercase flex items-center gap-1">
                      {typeIcon[s.type]} {s.type}
                    </span>
                    {s.isPremium && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Premium KES {s.price}</span>}
                    {s.fileUrl && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ File Uploaded</span>}
                    {s.videoLink && !s.fileUrl && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">🔗 Link</span>}
                    {!s.fileUrl && !s.videoLink && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">⚠ No Media</span>}
                  </div>
                  <h3 className="text-[#001F6B] font-bold truncate">{s.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm">By {s.speaker} · {new Date(s.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(s)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
