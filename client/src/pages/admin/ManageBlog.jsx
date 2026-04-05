import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Plus, Trash2, Edit, ArrowLeft, BookOpen, Eye, Star } from "lucide-react";

const empty = { title: "", excerpt: "", content: "", category: "news", author: "", tags: "", isFeatured: false, isPublished: true };

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPosts = () => api.get("/blog/all").then(res => setPosts(res.data.data || [])).catch(() => {});
  useEffect(() => { fetchPosts(); }, []);

  const handleChange = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      if (editing) await api.put(`/blog/${editing}`, data);
      else await api.post("/blog", data);
      setForm(empty); setEditing(null); setShowForm(false);
      fetchPosts();
    } catch (err) { alert(err.response?.data?.message || "Error saving post"); }
    finally { setLoading(false); }
  };

  const handleEdit = p => {
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, category: p.category, author: p.author, tags: p.tags?.join(", ") || "", isFeatured: p.isFeatured, isPublished: p.isPublished });
    setEditing(p._id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/blog/${id}`); fetchPosts();
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">Manage Blog</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-white text-[#0038B8] font-bold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/90">
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#0038B8]/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h2 className="text-[#001F6B] text-xl font-bold mb-6">{editing ? "Edit Post" : "New Blog Post"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Post title..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Author</label>
                <input name="author" value={form.author} onChange={handleChange} required placeholder="Author name"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]">
                  {["news","testimony","devotional","announcement","teaching"].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Excerpt (short summary)</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={2} placeholder="Brief summary of the post..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Content</label>
                <textarea name="content" value={form.content} onChange={handleChange} required rows={10} placeholder="Write your full post content here..."
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B] resize-none" />
              </div>
              <div>
                <label className="text-[#001F6B] text-sm font-bold mb-2 block">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="sabbath, worship, torah"
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4" />
                  <span className="text-[#001F6B] text-sm font-bold">Featured Post</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4" />
                  <span className="text-[#001F6B] text-sm font-bold">Published</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#001F6B] transition-colors disabled:opacity-60">
                  {loading ? "Saving..." : editing ? "Update Post" : "Publish Post"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-xl">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <p className="text-[#001F6B]/50">No blog posts yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map(p => (
              <div key={p._id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-[#0038B8] bg-[#0038B8]/10 px-2 py-1 rounded-full capitalize">{p.category}</span>
                    {p.isFeatured && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1"><Star size={10} /> Featured</span>}
                    {!p.isPublished && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Draft</span>}
                  </div>
                  <h3 className="text-[#001F6B] font-bold truncate">{p.title}</h3>
                  <p className="text-[#001F6B]/50 text-sm flex items-center gap-3">
                    <span>By {p.author}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {p.views} views</span>
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link to={`/blog/${p.slug}`} target="_blank" className="p-2 text-green-500 hover:bg-green-50 rounded-xl"><Eye size={18} /></Link>
                  <button onClick={() => handleEdit(p)} className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
