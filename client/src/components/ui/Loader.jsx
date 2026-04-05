export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin"></div>
        <p className="text-[#0038B8]/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
