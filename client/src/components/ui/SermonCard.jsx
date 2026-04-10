import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Headphones, Video, Lock, Play } from "lucide-react";
import { format } from "date-fns";
import api from "../../utils/api";

const icons = { pdf: FileText, audio: Headphones, video: Video };

function MediaPlayer({ sermon, onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onClose}>
      <div
        style={{ backgroundColor: "white", borderRadius: "20px", width: "100%", maxWidth: "800px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: "4px", backgroundColor: "#0038B8" }} />
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <h3 style={{ color: "#001F6B", fontWeight: "bold", fontSize: "16px", margin: 0 }}>{sermon.title}</h3>
            <p style={{ color: "#0038B8", fontSize: "12px", margin: "2px 0 0 0" }}>By {sermon.speaker}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#001F6B", opacity: 0.5, fontSize: "22px" }}>✕</button>
        </div>
        <div>
          {sermon.type === "video" && (
            <video controls autoPlay style={{ width: "100%", maxHeight: "450px", backgroundColor: "#000" }} src={sermon.fileUrl}>
              Your browser does not support video playback.
            </video>
          )}
          {sermon.type === "audio" && (
            <div style={{ padding: "40px 24px", backgroundColor: "#F0F5FF" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "#0038B8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <span style={{ fontSize: "32px" }}>🎵</span>
                </div>
                <p style={{ color: "#001F6B", fontWeight: "bold", margin: 0 }}>{sermon.title}</p>
                <p style={{ color: "#001F6B", opacity: 0.5, fontSize: "14px", margin: "4px 0 0 0" }}>{sermon.speaker}</p>
              </div>
              <audio controls autoPlay style={{ width: "100%" }} src={sermon.fileUrl}>
                Your browser does not support audio playback.
              </audio>
            </div>
          )}
          {sermon.type === "pdf" && (
            <div style={{ height: "500px" }}>
              <iframe src={sermon.fileUrl} style={{ width: "100%", height: "100%", border: "none" }} title={sermon.title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MpesaModal({ sermon, onClose, onPaymentSuccess }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("input");
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/mpesa/stk-push", { phone, sermonId: sermon.id });
      setStep("waiting");
      pollPaymentStatus(res.data.checkoutRequestId);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const pollPaymentStatus = (id) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await api.get(`/mpesa/status/${id}`);
        if (res.data.status === "completed") {
          clearInterval(interval);
          setReceipt(res.data.receipt);
          setStep("success");
        } else if (res.data.status === "failed") {
          clearInterval(interval);
          setStep("failed");
        }
      } catch (err) {}
      if (attempts >= 20) { clearInterval(interval); setStep("failed"); }
    }, 3000);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onClose}>
      <div
        style={{ backgroundColor: "white", borderRadius: "24px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: "6px", backgroundColor: "#0038B8" }} />
        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h3 style={{ color: "#001F6B", fontSize: "20px", fontWeight: "bold", margin: 0 }}>Unlock Premium Sermon</h3>
              <p style={{ color: "#0038B8", fontSize: "14px", fontWeight: "600", margin: "4px 0 0 0" }}>{sermon.title}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#001F6B", opacity: 0.4, fontSize: "20px" }}>✕</button>
          </div>

          {step === "input" && (
            <>
              <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>M</span>
                </div>
                <div>
                  <p style={{ color: "#166534", fontWeight: "bold", fontSize: "14px", margin: 0 }}>Lipa Na M-Pesa</p>
                  <p style={{ color: "#16a34a", fontSize: "12px", margin: "2px 0 0 0" }}>Amount: KES {sermon.price}</p>
                </div>
              </div>
              {error && (
                <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "14px", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}
              <form onSubmit={handlePayment}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#001F6B", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>M-Pesa Phone Number</label>
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="e.g. 0712345678"
                    style={{ width: "100%", border: "2px solid rgba(0,56,184,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", color: "#001F6B", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "#0038B8"}
                    onBlur={e => e.target.style.borderColor = "rgba(0,56,184,0.2)"}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", backgroundColor: loading ? "#86efac" : "#22c55e", color: "white", fontWeight: "bold", padding: "14px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                  {loading ? "Sending prompt..." : `Pay KES ${sermon.price} via M-Pesa`}
                </button>
              </form>
              <p style={{ color: "rgba(0,31,107,0.4)", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
                You will receive an M-Pesa STK push. Enter your PIN to complete.
              </p>
            </>
          )}

          {step === "waiting" && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: "64px", height: "64px", border: "4px solid #bbf7d0", borderTop: "4px solid #22c55e", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
              <h4 style={{ color: "#001F6B", fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>Check Your Phone!</h4>
              <p style={{ color: "rgba(0,31,107,0.6)", fontSize: "14px" }}>Enter your M-Pesa PIN to pay KES {sermon.price}</p>
            </div>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
              <h4 style={{ color: "#001F6B", fontWeight: "bold", fontSize: "20px", marginBottom: "8px" }}>Payment Successful!</h4>
              <p style={{ color: "rgba(0,31,107,0.6)", fontSize: "14px", marginBottom: "8px" }}>You now have full access to this sermon.</p>
              {receipt && <p style={{ color: "#15803d", fontWeight: "bold", fontSize: "16px", marginBottom: "16px" }}>Receipt: {receipt}</p>}
              <button onClick={() => { onPaymentSuccess(); onClose(); }}
                style={{ backgroundColor: "#0038B8", color: "white", fontWeight: "bold", padding: "12px 24px", borderRadius: "50px", border: "none", cursor: "pointer" }}>
                Access Sermon →
              </button>
            </div>
          )}

          {step === "failed" && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
              <h4 style={{ color: "#001F6B", fontWeight: "bold", fontSize: "20px", marginBottom: "8px" }}>Payment Failed</h4>
              <p style={{ color: "rgba(0,31,107,0.6)", fontSize: "14px", marginBottom: "24px" }}>The payment was not completed. Please try again.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={() => { setStep("input"); setError(""); setPhone(""); }}
                  style={{ backgroundColor: "#0038B8", color: "white", fontWeight: "bold", padding: "12px 24px", borderRadius: "50px", border: "none", cursor: "pointer" }}>Try Again</button>
                <button onClick={onClose}
                  style={{ backgroundColor: "white", color: "#001F6B", fontWeight: "bold", padding: "12px 24px", borderRadius: "50px", border: "2px solid rgba(0,31,107,0.2)", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function SermonCard({ sermon }) {
  const [showPayment, setShowPayment] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const Icon = icons[sermon.type] || FileText;

  const hasMedia = sermon.fileUrl || sermon.videoLink;

  const handlePlay = () => {
    if (!hasMedia) return;
    if (sermon.isPremium && !unlocked) {
      setShowPayment(true);
    } else if (sermon.videoLink && !sermon.fileUrl) {
      window.open(sermon.videoLink, "_blank");
    } else {
      setShowPlayer(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-md p-6 border border-[#0038B8]/10 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-[#0038B8]/10 rounded-xl flex items-center justify-center">
            <Icon size={22} className="text-[#0038B8]" />
          </div>
          <div className="flex items-center gap-2">
            {sermon.isPremium && !unlocked && (
              <span className="flex items-center gap-1 bg-[#0038B8]/10 text-[#0038B8] text-xs font-bold px-2 py-1 rounded-full">
                <Lock size={10} /> Premium
              </span>
            )}
            {unlocked && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">✓ Unlocked</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[#001F6B] font-bold text-lg mb-1">{sermon.title}</h3>
          <p className="text-[#001F6B]/60 text-sm mb-2 line-clamp-2">{sermon.description}</p>
          <p className="text-[#001F6B]/40 text-xs">By {sermon.speaker} — {format(new Date(sermon.date), "MMM d, yyyy")}</p>
        </div>

        {sermon.isPremium && !unlocked ? (
          <button onClick={() => setShowPayment(true)}
            className="mt-auto bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Lock size={14} /> Unlock via M-Pesa — KES {sermon.price}
          </button>
        ) : hasMedia ? (
          <button onClick={handlePlay}
            className="mt-auto bg-[#0038B8] hover:bg-[#001F6B] text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Play size={14} />
            {sermon.type === "video" && "Watch Sermon"}
            {sermon.type === "audio" && "Listen to Sermon"}
            {sermon.type === "pdf" && "Read / Download PDF"}
          </button>
        ) : (
          <div className="mt-auto text-center py-2 text-[#001F6B]/30 text-xs italic">No media uploaded yet</div>
        )}
      </motion.div>

      <AnimatePresence>
        {showPlayer && <MediaPlayer sermon={sermon} onClose={() => setShowPlayer(false)} />}
        {showPayment && (
          <MpesaModal
            sermon={sermon}
            onClose={() => setShowPayment(false)}
            onPaymentSuccess={() => { setUnlocked(true); setShowPlayer(true); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
