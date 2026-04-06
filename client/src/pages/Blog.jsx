import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Eye } from "lucide-react";
import { format } from "date-fns";
import api from "../utils/api";

const categoryColors = {
  news: { bg: "bg-blue-50", text: "text-blue-700" },
  testimony: { bg: "bg-green-50", text: "text-green-700" },
  devotional: { bg: "bg-purple-50", text: "text-purple-700" },
  announcement: { bg: "bg-orange-50", text: "text-orange-700" },
  teaching: { bg: "bg-red-50", text: "text-red-700" },
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/blog?category=${category}&search=${search}`)
      .then(res => setPosts(res.data.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const categories = ["all", "news", "testimony", "devotional", "announcement", "teaching"];

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">News & Updates</p>
            <h1 className="text-white text-5xl font-bold mb-3">Church Blog</h1>
            <p className="text-white/70">News, testimonies, devotionals and teachings from Sabbathtarian Church of Elohim.</p>
          </motion.div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0038B8]/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
              className="w-full border-2 border-[#0038B8]/15 focus:border-[#0038B8] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none text-[#001F6B]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${category === cat ? "bg-[#0038B8] text-white" : "bg-gray-100 text-gray-600 hover:bg-[#0038B8]/10 hover:text-[#0038B8]"}`}>
                {cat === "all" ? "All Posts" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#0038B8]/20 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-xl font-bold mb-2">No Posts Found</h3>
            <p className="text-[#001F6B]/50 text-sm">Check back soon for new posts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/blog/${post.slug}`)}>
                <div className="h-1.5" style={{ background: post.category === "teaching" ? "#dc2626" : post.category === "testimony" ? "#16a34a" : post.category === "devotional" ? "#7c3aed" : post.category === "announcement" ? "#f97316" : "#0038B8" }} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${categoryColors[post.category]?.bg} ${categoryColors[post.category]?.text}`}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-[#001F6B]/30 text-xs"><Eye size={12} />{post.views}</div>
                  </div>
                  <h3 className="text-[#001F6B] font-bold text-lg mb-2 leading-tight line-clamp-2">{post.title}</h3>
                  <p className="text-[#001F6B]/60 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt || post.content.slice(0, 120) + "..."}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#0038B8] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{post.author[0]}</span>
                      </div>
                      <span className="text-[#001F6B]/60 text-xs">{post.author}</span>
                    </div>
                    <span className="text-[#001F6B]/40 text-xs">{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
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
