import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Headphones, Video, Lock, ExternalLink, X, Phone, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import api, { SERVER_URL } from "../../utils/api";

const icons = { pdf: FileText, audio: Headphones, video: Video };

function MpesaModal({ sermon, onClose }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("input");
  const [checkoutId, setCheckoutId] = useState("");
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/mpesa/stk-push", { phone, sermonId: sermon.id });
      setCheckoutId(res.data.checkoutRequestId);
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
      } catch (err) {
        clearInterval(interval);
        setError("Could not verify payment status. Please contact support.");
        setStep("failed");
      }
      if (attempts >= 20) {
        clearInterval(interval);
        setStep("failed");
      }
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="h-2 bg-[#0038B8]" />
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[#001F6B] text-xl font-bold">Unlock Premium Sermon</h3>
              <p className="text-[#0038B8] text-sm font-semibold mt-1">{sermon.title}</p>
            </div>
            <button onClick={onClose} className="text-[#001F6B]/30 hover:text-[#001F6B]"><X size={20} /></button>
          </div>

          {step === "input" && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <div>
                  <p className="text-green-800 font-bold text-sm">Pay via M-Pesa</p>
                  <p className="text-green-600 text-xs">Amount: KES {sermon.price}</p>
                </div>
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <div>
                  <label className="text-[#001F6B] text-sm font-bold mb-2 block">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0038B8]/50" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} required
                      placeholder="0712345678 or 254712345678"
                      className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl pl-10 pr-4 py-3 text-sm outline-none text-[#001F6B]" />
                  </div>
                  <p className="text-[#001F6B]/40 text-xs mt-1">Enter your M-Pesa registered phone number</p>
                </div>
                <button type="submit" disabled={loading}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Pay KES {sermon.price} via M-Pesa</>}
                </button>
              </form>
              <p className="text-[#001F6B]/40 text-xs text-center mt-4">You will receive an M-Pesa prompt. Enter your PIN to complete.</p>
            </>
          )}

          {step === "waiting" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
              <h4 className="text-[#001F6B] font-bold text-lg mb-2">Waiting for Payment</h4>
              <p className="text-[#001F6B]/60 text-sm mb-2">Check your phone for the M-Pesa prompt</p>
              <p className="text-[#001F6B]/40 text-xs">Enter your M-Pesa PIN to complete payment</p>
              <div className="mt-6 bg-green-50 rounded-xl p-4">
                <p className="text-green-700 text-sm font-semibold">Amount: KES {sermon.price}</p>
                <p className="text-green-600 text-xs mt-1">Sabbathtarian Church of Elohim</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h4 className="text-[#001F6B] font-bold text-xl mb-2">Payment Successful!</h4>
              <p className="text-[#001F6B]/60 text-sm mb-4">You now have access to this sermon.</p>
              {receipt && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-green-800 text-xs font-bold uppercase tracking-wider mb-1">M-Pesa Receipt</p>
                  <p className="text-green-700 font-bold text-lg">{receipt}</p>
                </div>
              )}
              {sermon.videoLink ? (
                <a href={sermon.videoLink} target="_blank" rel="noreferrer"
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-full hover:bg-[#001F6B] transition-colors flex items-center gap-2 justify-center">
                  Access Sermon <ExternalLink size={16} />
                </a>
              ) : sermon.fileUrl ? (
                <a href={`${SERVER_URL}${sermon.fileUrl}`} target="_blank" rel="noreferrer"
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-full hover:bg-[#001F6B] transition-colors flex items-center gap-2 justify-center">
                  Download Sermon <ExternalLink size={16} />
                </a>
              ) : (
                <button onClick={onClose} className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-full hover:bg-[#001F6B] transition-colors">Close</button>
              )}
            </div>
          )}

          {step === "failed" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-red-500" />
              </div>
              <h4 className="text-[#001F6B] font-bold text-xl mb-2">Payment Failed</h4>
              <p className="text-[#001F6B]/60 text-sm mb-6">The payment was not completed. Please try again.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setStep("input"); setError(""); }}
                  className="bg-[#0038B8] text-white font-bold px-6 py-3 rounded-full hover:bg-[#001F6B] transition-colors">Try Again</button>
                <button onClick={onClose}
                  className="border-2 border-[#0038B8]/20 text-[#001F6B] font-bold px-6 py-3 rounded-full hover:border-[#0038B8] transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SermonCard({ sermon }) {
  const [showPayment, setShowPayment] = useState(false);
  const Icon = icons[sermon.type] || FileText;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-md p-6 border border-[#0038B8]/10 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-[#0038B8]/10 rounded-xl flex items-center justify-center">
            <Icon size={22} className="text-[#0038B8]" />
          </div>
          {sermon.isPremium && (
            <span className="flex items-center gap-1 bg-[#0038B8]/10 text-[#0038B8] text-xs font-bold px-2 py-1 rounded-full">
              <Lock size={10} /> Premium
            </span>
          )}
        </div>
        <div>
          <h3 className="text-[#001F6B] font-bold text-lg mb-1">{sermon.title}</h3>
          <p className="text-[#001F6B]/60 text-sm mb-2 line-clamp-2">{sermon.description}</p>
          <p className="text-[#001F6B]/40 text-xs">By {sermon.speaker} — {format(new Date(sermon.date), "MMM d, yyyy")}</p>
        </div>
        {sermon.isPremium ? (
          <button onClick={() => setShowPayment(true)}
            className="mt-auto bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Lock size={14} /> Unlock via M-Pesa — KES {sermon.price}
          </button>
        ) : sermon.videoLink ? (
          <a href={sermon.videoLink} target="_blank" rel="noreferrer"
            className="mt-auto flex items-center gap-2 text-[#0038B8] font-semibold text-sm hover:text-[#001F6B] transition-colors">
            Watch / Listen <ExternalLink size={14} />
          </a>
        ) : sermon.fileUrl ? (
          <a href={`${SERVER_URL}${sermon.fileUrl}`} target="_blank" rel="noreferrer"
            className="mt-auto flex items-center gap-2 text-[#0038B8] font-semibold text-sm hover:text-[#001F6B] transition-colors">
            Open File <ExternalLink size={14} />
          </a>
        ) : null}
      </motion.div>

      <AnimatePresence>
        {showPayment && <MpesaModal sermon={sermon} onClose={() => setShowPayment(false)} />}
      </AnimatePresence>
    </>
  );
}
