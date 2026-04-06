const prisma = require("../lib/prisma");

exports.getLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    const total = await prisma.activityLog.count();
    res.json({ success: true, data: logs, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.clearLogs = async (req, res) => {
  try {
    await prisma.activityLog.deleteMany({});
    res.json({ success: true, message: "Logs cleared" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
