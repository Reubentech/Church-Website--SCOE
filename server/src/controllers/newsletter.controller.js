const prisma = require("../lib/prisma");

exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    const exists = await prisma.newsletter.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return res.json({ success: true, message: "Already subscribed!" });
    await prisma.newsletter.create({ data: { email: email.toLowerCase(), name: name || "" } });
    res.status(201).json({ success: true, message: "Subscribed successfully!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.newsletter.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: subscribers, count: subscribers.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.unsubscribe = async (req, res) => {
  try {
    await prisma.newsletter.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: "Unsubscribed" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
