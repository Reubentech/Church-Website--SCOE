import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Calendar, BookOpen, Image, MessageSquare, Users, LogOut, Heart, Bell, Mail, Book, Settings, Activity, BarChart2, FileText, Newspaper } from "lucide-react";

function StarOfDavid() {
  const cx = 20, cy = 20, r = 14;
  const p1 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  const p2 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 + 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  return <svg width="40" height="40" viewBox="0 0 40 40"><polygon points={p1} fill="none" stroke="white" strokeWidth="2"/><polygon points={p2} fill="none" stroke="white" strokeWidth="2"/></svg>;
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get("/analytics").then(res => setAnalytics(res.data.data)).catch(() => {});
  }, []);

  const stats = [
    { label: "Users", value: analytics?.users ?? 0, icon: Users },
    { label: "Events", value: analytics?.events ?? 0, icon: Calendar },
    { label: "Sermons", value: analytics?.sermons ?? 0, icon: BookOpen },
    { label: "Gallery", value: analytics?.gallery ?? 0, icon: Image },
    { label: "Messages", value: analytics?.messages ?? 0, icon: MessageSquare },
    { label: "Unread", value: analytics?.unreadMessages ?? 0, icon: MessageSquare },
  ];

  const sections = [
    {
      title: "Content Management",
      links: [
        { label: "Events", icon: Calendar, path: "/admin/events", desc: "Create & edit events" },
        { label: "Sermons", icon: BookOpen, path: "/admin/sermons", desc: "Upload sermons" },
        { label: "Gallery", icon: Image, path: "/admin/gallery", desc: "Upload photos" },
        { label: "Bible Study", icon: Book, path: "/admin/bible-study", desc: "Post weekly notes" },
        { label: "Blog", icon: Newspaper, path: "/admin/blog", desc: "Write news & posts" },
        { label: "Bulletin", icon: FileText, path: "/admin/bulletin", desc: "Weekly church bulletin" },
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Messages", icon: MessageSquare, path: "/admin/messages", desc: "Contact messages" },
        { label: "Prayer Requests", icon: Heart, path: "/admin/prayers", desc: "Prayer requests" },
        { label: "Newsletter", icon: Mail, path: "/admin/newsletter", desc: "Subscribers" },
        { label: "Announcements", icon: Bell, path: "/admin/announcements", desc: "Site announcements" },
      ]
    },
    {
      title: "Administration",
      links: [
        { label: "Users", icon: Users, path: "/admin/users", desc: "Manage user accounts" },
        { label: "Analytics", icon: BarChart2, path: "/admin/analytics", desc: "Charts & statistics" },
        { label: "Activity Logs", icon: Activity, path: "/admin/logs", desc: "Track all actions" },
        { label: "Site Settings", icon: Settings, path: "/admin/settings", desc: "Church info & social links" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StarOfDavid />
            <div>
              <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-white/60 text-sm">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
              <div className="w-10 h-10 bg-[#0038B8]/10 rounded-xl flex items-center justify-center mb-3">
                <Icon size={18} className="text-[#0038B8]" />
              </div>
              <p className="text-[#001F6B] text-2xl font-bold">{value}</p>
              <p className="text-[#001F6B]/50 text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {sections.map(({ title, links }, si) => (
          <div key={title} className="mb-10">
            <h2 className="text-[#001F6B] text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#0038B8] inline-block rounded" />
              {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {links.map(({ label, icon: Icon, path, desc }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + si * 0.1 + i * 0.05 }}>
                  <Link to={path} className="block bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 bg-[#0038B8]/10 group-hover:bg-[#0038B8] rounded-2xl flex items-center justify-center mb-4 transition-colors">
                      <Icon size={24} className="text-[#0038B8] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-[#001F6B] font-bold mb-1">{label}</h3>
                    <p className="text-[#001F6B]/50 text-sm">{desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
