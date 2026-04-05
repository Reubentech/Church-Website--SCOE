const Gallery = require("../models/Gallery.model");

exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const image = await Gallery.create({ ...req.body, imageUrl, createdBy: req.user._id });
    res.status(201).json({ success: true, data: image });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Image deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
