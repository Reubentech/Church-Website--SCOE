const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

exports.getUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const users = await prisma.user.findMany({
      where: search ? { OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]} : {},
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" });
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(400).json({ success: false, message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), password: hashed, role: role || "user" } });
    res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email.toLowerCase();
    if (role) data.role = role;
    if (password && password.trim()) data.password = await bcrypt.hash(password, 12);
    const user = await prisma.user.update({ where: { id: req.params.id }, data, select: { id: true, name: true, email: true, role: true } });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role" });
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role }, select: { id: true, name: true, email: true, role: true } });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ success: false, message: "Cannot delete yourself" });
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "User deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: "No user IDs provided" });
    if (ids.includes(req.user.id)) return res.status(400).json({ success: false, message: "Cannot delete yourself" });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true, message: `${ids.length} users deleted` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
