const Bulletin = require("../models/Bulletin.model");

exports.getBulletins = async (req, res) => {
  try {
    const bulletins = await Bulletin.find({ isPublished: true }).sort({ date: -1 });
    res.json({ success: true, data: bulletins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllBulletins = async (req, res) => {
  try {
    const bulletins = await Bulletin.find().sort({ date: -1 });
    res.json({ success: true, data: bulletins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createBulletin = async (req, res) => {
  try {
    const bulletin = await Bulletin.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: bulletin });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateBulletin = async (req, res) => {
  try {
    const bulletin = await Bulletin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bulletin) return res.status(404).json({ success: false, message: "Bulletin not found" });
    res.json({ success: true, data: bulletin });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteBulletin = async (req, res) => {
  try {
    await Bulletin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Bulletin deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
