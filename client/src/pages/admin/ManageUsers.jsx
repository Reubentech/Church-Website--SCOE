import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import { ArrowLeft, Search, Trash2, Download, Plus, X, Edit, Eye, EyeOff, Shield, User } from "lucide-react";

const emptyForm = { name: "", email: "", password: "", role: "user" };

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user ? { name: user.name, email: user.email, password: "", role: user.role } : emptyForm);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (user) await api.put(`/users/${user.id}`, form);
      else {
        if (!form.password) { setError("Password is required"); setLoading(false); return; }
        await api.post("/users", form);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="h-2 bg-[#0038B8]" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#001F6B] text-xl font-bold">{user ? "Edit User" : "Add New User"}</h3>
            <button onClick={onClose} className="text-[#001F6B]/30 hover:text-[#001F6B]"><X size={20} /></button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="John Doe"
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="user@church.org"
                className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 text-sm outline-none text-[#001F6B]" />
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">{user ? "New Password (leave blank to keep)" : "Password"}</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder={user ? "Leave blank to keep current" : "Min. 6 characters"} required={!user}
                  className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl px-4 py-3 pr-12 text-sm outline-none text-[#001F6B]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0038B8]/50">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[#001F6B] text-sm font-bold mb-2 block">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {["user", "admin"].map(r => (
                  <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                    className={`py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${form.role === r ? "bg-[#0038B8] border-[#0038B8] text-white" : "border-[#0038B8]/20 text-[#001F6B]/60"}`}>
                    {r === "admin" ? <Shield size={16} /> : <User size={16} />}
                    {r === "admin" ? "Admin" : "User"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#0038B8] hover:bg-[#001F6B] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : user ? "Update User" : "Create User"}
              </button>
              <button type="button" onClick={onClose} className="px-6 border-2 border-[#0038B8]/20 text-[#001F6B] font-bold rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get(`/users?search=${search}`).then(res => setUsers(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleDelete = async id => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} users?`)) return;
    await api.delete("/users/bulk", { data: { ids: selected } });
    setSelected([]);
    fetchUsers();
  };

  const handleRoleChange = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    fetchUsers();
  };

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === users.length ? [] : users.map(u => u.id));

  const exportCSV = () => {
    const csv = ["Name,Email,Role,Joined", ...users.map(u => `${u.name},${u.email},${u.role},${new Date(u.createdAt).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF]">
      <div className="bg-[#0038B8] pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link to="/admin" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-white text-3xl font-bold">User Management</h1>
            <p className="text-white/60 text-sm mt-1">{users.length} total users</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {selected.length > 0 && (
              <button onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Trash2 size={16} /> Delete {selected.length}
              </button>
            )}
            <button onClick={exportCSV} className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-white/30">
              <Download size={16} /> Export CSV
            </button>
            <button onClick={() => { setEditingUser(null); setShowModal(true); }}
              className="bg-white text-[#0038B8] font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-white/90">
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0038B8]/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full border-2 border-[#0038B8]/20 focus:border-[#0038B8] rounded-xl pl-10 pr-4 py-3 text-sm outline-none text-[#001F6B] bg-white" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0038B8]/20 border-t-[#0038B8] rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#0038B8]/10 overflow-hidden">
            <div className="h-1 bg-[#0038B8]" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0038B8]/10 bg-[#F0F5FF]">
                    <th className="p-4 text-left w-10">
                      <input type="checkbox" checked={selected.length === users.length && users.length > 0} onChange={toggleAll} className="w-4 h-4 cursor-pointer" />
                    </th>
                    <th className="p-4 text-left text-[#001F6B] text-sm font-bold">User</th>
                    <th className="p-4 text-left text-[#001F6B] text-sm font-bold">Role</th>
                    <th className="p-4 text-left text-[#001F6B] text-sm font-bold">Joined</th>
                    <th className="p-4 text-left text-[#001F6B] text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`border-b border-[#0038B8]/5 hover:bg-[#F0F5FF] transition-colors ${selected.includes(user.id) ? "bg-blue-50" : ""}`}>
                      <td className="p-4">
                        <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleSelect(user.id)} className="w-4 h-4 cursor-pointer" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${user.role === "admin" ? "bg-[#0038B8]" : "bg-[#0038B8]/20"}`}>
                            <span className={`font-bold text-sm ${user.role === "admin" ? "text-white" : "text-[#0038B8]"}`}>{user.name[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-[#001F6B] font-semibold text-sm">{user.name}</p>
                            <p className="text-[#001F6B]/50 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 outline-none cursor-pointer ${user.role === "admin" ? "bg-[#0038B8]/10 text-[#0038B8] border-[#0038B8]/30" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-[#001F6B]/50 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingUser(user); setShowModal(true); }}
                            className="p-2 text-[#0038B8] hover:bg-[#0038B8]/10 rounded-xl transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-16">
                  <User size={40} className="text-[#0038B8]/30 mx-auto mb-3" />
                  <p className="text-[#001F6B]/50 mb-4">No users found</p>
                  <button onClick={() => { setEditingUser(null); setShowModal(true); }}
                    className="bg-[#0038B8] text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-[#001F6B] transition-colors">
                    Add First User
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <UserModal user={editingUser} onClose={() => setShowModal(false)} onSave={fetchUsers} />}
      </AnimatePresence>
    </div>
  );
}
