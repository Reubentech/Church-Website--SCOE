const BibleStudy = require("../models/BibleStudy.model");

exports.getBibleStudies = async (req, res) => {
  try {
    const studies = await BibleStudy.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: studies });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllBibleStudies = async (req, res) => {
  try {
    const studies = await BibleStudy.find().sort({ createdAt: -1 });
    res.json({ success: true, data: studies });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createBibleStudy = async (req, res) => {
  try {
    const study = await BibleStudy.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: study });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateBibleStudy = async (req, res) => {
  try {
    const study = await BibleStudy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: study });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteBibleStudy = async (req, res) => {
  try {
    await BibleStudy.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
