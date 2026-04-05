const Contact = require("../models/Contact.model");
const sendEmail = require("../utils/email.utils");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    try { await sendEmail({ name, email, subject, message }); } catch (e) { console.log("Email failed:", e.message); }
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: "Marked as read" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
