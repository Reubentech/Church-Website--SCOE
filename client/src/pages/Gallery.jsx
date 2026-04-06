import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api, { SERVER_URL } from "../utils/api";
import { X, ChevronLeft, ChevronRight, Image } from "lucide-react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/gallery").then(res => setImages(res.data.data || [])).catch(() => setImages([])).finally(() => setLoading(false));
  }, []);

  const prev = () => setSelected(i => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setSelected(i => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0038B8] pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><polygon points="50,8 61,35 90,35 67,52 76,80 50,63 24,80 33,52 10,35 39,35" fill="none" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">Our Moments</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold">Photo Gallery</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Image size={48} className="text-[#0038B8]/30 mx-auto mb-4" />
            <h3 className="text-[#001F6B] text-xl font-bold mb-2">No Photos Yet</h3>
            <p className="text-[#001F6B]/50 text-sm">Gallery photos will appear here.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                whileHover={{ scale: 1.03 }} onClick={() => setSelected(i)}
                className="aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md border border-[#0038B8]/10">
                <img src={`${SERVER_URL}${img.imageUrl}`} alt={img.title} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4"
            onClick={() => setSelected(null)}>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all">
              <ChevronLeft size={24} />
            </button>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
              <img src={`${SERVER_URL}${images[selected]?.imageUrl}`} alt={images[selected]?.title}
                className="w-full max-h-[80vh] object-contain rounded-2xl" />
              <p className="text-white text-center mt-4 font-semibold">{images[selected]?.title}</p>
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all">
              <ChevronRight size={24} />
            </button>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 p-2 rounded-full">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
