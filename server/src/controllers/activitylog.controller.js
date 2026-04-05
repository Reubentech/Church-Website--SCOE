const ActivityLog = require("../models/ActivityLog.model");
exports.getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    const total = await ActivityLog.countDocuments();
    res.json({ success: true, data: logs, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.clearLogs = async (req, res) => {
  try {
    await ActivityLog.deleteMany({});
    res.json({ success: true, message: "Logs cleared" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
