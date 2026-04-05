import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import api from "../../utils/api";
import { ArrowLeft, TrendingUp } from "lucide-react";

const COLORS = ["#0038B8", "#4A7FD4", "#001F6B", "#7BA8E8", "#B8D0F5"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics").then(res => setAnalytics(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F0F5FF] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" />
    </div>
  );

  const pieData = analytics ? [
    { name: "Events", value: analytics.events || 0 },
    { name: "Sermons", value: analytics.sermons || 0 },
    { name: "Gallery", value: analytics.gallery || 0 },
    { name: "Users", value: analytics.users || 0 },
    { name: "Messages", value: analytics.messages || 0 },
  ] : [];

  const barData = analytics ? [
    { name: "Users", count: analytics.users || 0 },
    { name: "Events", count: analytics.events || 0 },
    { name: "Sermons", count: analytics.sermons || 0 },
    { name: "Gallery", count: analytics.gallery || 0 },
    { name: "Messages", count: analytics.messages || 0 },
    { name: "Unread", count: analytics.unreadMessages || 0 },
  ] : [];

  const stats = [
    { label: "Total Users", value: analytics?.users ?? 0, color: "#0038B8" },
    { label: "Total Events", value: analytics?.events ?? 0, color: "#4A7FD4" },
    { label: "Total Sermons", value: analytics?.sermons ?? 0, color: "#001F6B" },
    { label: "Gallery Photos", value: analytics?.gallery ?? 0, color: "#7BA8E8" },
    { label: "Total Messages", value: analytics?.messages ?? 0, color: "#0038B8" },
    { label: "Unread Messages", value: analytics?.unreadMessages ?? 0, color: "#dc2626" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
          <h1 className="text-white text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">Overview of your church website statistics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {stats.map(({ label, value, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />
              <p className="text-3xl font-bold mb-1" style={{ color }}>{value}</p>
              <p className="text-[#001F6B]/50 text-xs">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h3 className="text-[#001F6B] font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#0038B8]" /> Content Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f5ff" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#001F6B" }} />
                <YAxis tick={{ fontSize: 12, fill: "#001F6B" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "2px solid #0038B8" }} />
                <Bar dataKey="count" fill="#0038B8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#0038B8]/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038B8]" />
            <h3 className="text-[#001F6B] font-bold text-lg mb-6">Content Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "2px solid #0038B8" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {pieData.map(({ name }, i) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[#001F6B]/60 text-xs">{name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
