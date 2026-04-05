const Newsletter = require("../models/Newsletter.model");

exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    const exists = await Newsletter.findOne({ email });
    if (exists) return res.json({ success: true, message: "Already subscribed!" });
    await Newsletter.create({ email, name });
    res.status(201).json({ success: true, message: "Subscribed successfully!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers, count: subscribers.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.unsubscribe = async (req, res) => {
  try {
    await Newsletter.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Unsubscribed" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
