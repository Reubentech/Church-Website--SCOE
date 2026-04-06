const prisma = require("../lib/prisma");
const sendEmail = require("../utils/email.utils");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await prisma.contact.create({ data: { name, email, subject, message } });
    try { await sendEmail({ name, email, subject, message }); } catch (e) { console.log("Email failed:", e.message); }
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: contacts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await prisma.contact.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json({ success: true, message: "Marked as read" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
