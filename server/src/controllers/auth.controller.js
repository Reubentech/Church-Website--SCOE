const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { withRetry } = require("../lib/prisma");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "30d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(400).json({ success: false, message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name: name.trim(), email: email.toLowerCase(), password: hashed } });
    await prisma.activityLog.create({ data: { userId: user.id, userName: user.name, action: "register", resource: "auth", ip: req.ip } });
    const token = generateToken(user.id);
    res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    const user = await withRetry(() => prisma.user.findUnique({ where: { email: email.toLowerCase() } }));
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });
    await prisma.activityLog.create({ data: { userId: user.id, userName: user.name, action: "login", resource: "auth", ip: req.ip } });
    const token = generateToken(user.id);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
