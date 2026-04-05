const PrayerRequest = require("../models/PrayerRequest.model");

exports.submitPrayerRequest = async (req, res) => {
  try {
    const prayer = await PrayerRequest.create(req.body);
    res.status(201).json({ success: true, message: "Prayer request submitted", data: prayer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPrayerRequests = async (req, res) => {
  try {
    const prayers = await PrayerRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: prayers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markAnswered = async (req, res) => {
  try {
    await PrayerRequest.findByIdAndUpdate(req.params.id, { isAnswered: true });
    res.json({ success: true, message: "Marked as answered" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePrayerRequest = async (req, res) => {
  try {
    await PrayerRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
