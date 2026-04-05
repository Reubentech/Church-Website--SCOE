import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Eye, Calendar, User, Tag } from "lucide-react";
import api from "../utils/api";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/${slug}`).then(res => setPost(res.data.data)).catch(() => setPost(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-[#001F6B] text-2xl font-bold mb-4">Post Not Found</h2>
      <Link to="/blog" className="bg-[#0038B8] text-white px-6 py-3 rounded-full font-bold hover:bg-[#001F6B] transition-colors">Back to Blog</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-6"><ArrowLeft size={14} /> Back to Blog</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full capitalize mb-4 inline-block">{post.category}</span>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
            <p className="text-white/70 text-lg mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-6 text-white/60 text-sm flex-wrap">
              <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {post.views} views</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="prose max-w-none text-[#001F6B] leading-relaxed"
            style={{ fontSize: "17px", lineHeight: "1.9" }}>
            {post.content.split("\n").map((para, i) => (
              para.trim() ? <p key={i} className="mb-4 text-[#001F6B]/80">{para}</p> : <br key={i} />
            ))}
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#0038B8]/10">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={16} className="text-[#0038B8]" />
                {post.tags.map(tag => (
                  <span key={tag} className="bg-[#0038B8]/10 text-[#0038B8] text-xs font-bold px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-[#0038B8]/10 flex items-center justify-between">
            <Link to="/blog" className="flex items-center gap-2 text-[#0038B8] font-bold hover:text-[#001F6B] transition-colors">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
