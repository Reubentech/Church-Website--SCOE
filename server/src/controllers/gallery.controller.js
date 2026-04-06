const prisma = require("../lib/prisma");

exports.getGallery = async (req, res) => {
  try {
    const images = await prisma.gallery.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: images });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllGallery = async (req, res) => {
  try {
    const images = await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: images });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const { title, description, category, isPublished } = req.body;
    const image = await prisma.gallery.create({ data: { title, description: description || "", imageUrl, category: category || "other", isPublished: isPublished !== undefined ? Boolean(isPublished) : true, createdBy: req.user.id } });
    res.status(201).json({ success: true, data: image });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteImage = async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Image deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
