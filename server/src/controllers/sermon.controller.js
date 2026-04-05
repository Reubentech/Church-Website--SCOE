const Sermon = require("../models/Sermon.model");

exports.getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find({ isPublished: true }).sort({ date: -1 });
    res.json({ success: true, data: sermons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.json({ success: true, data: sermons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSermon = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const sermon = await Sermon.create({ ...req.body, fileUrl, createdBy: req.user._id });
    res.status(201).json({ success: true, data: sermon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sermon) return res.status(404).json({ success: false, message: "Sermon not found" });
    res.json({ success: true, data: sermon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSermon = async (req, res) => {
  try {
    await Sermon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Sermon deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
