const prisma = require("../lib/prisma");

exports.submitPrayerRequest = async (req, res) => {
  try {
    const { name, email, request, isAnonymous } = req.body;
    const prayer = await prisma.prayerRequest.create({ data: { name, email: email || "", request, isAnonymous: Boolean(isAnonymous) } });
    res.status(201).json({ success: true, message: "Prayer request submitted", data: prayer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPrayerRequests = async (req, res) => {
  try {
    const prayers = await prisma.prayerRequest.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: prayers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markAnswered = async (req, res) => {
  try {
    await prisma.prayerRequest.update({ where: { id: req.params.id }, data: { isAnswered: true } });
    res.json({ success: true, message: "Marked as answered" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePrayerRequest = async (req, res) => {
  try {
    await prisma.prayerRequest.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
