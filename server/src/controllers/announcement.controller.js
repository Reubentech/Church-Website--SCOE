const prisma = require("../lib/prisma");

exports.getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: announcements });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: announcements });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { message, type, isActive, link, linkText } = req.body;
    const announcement = await prisma.announcement.create({ data: { message, type: type || "info", isActive: isActive !== undefined ? Boolean(isActive) : true, link: link || "", linkText: linkText || "" } });
    res.status(201).json({ success: true, data: announcement });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isActive !== undefined) data.isActive = Boolean(data.isActive);
    const announcement = await prisma.announcement.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: announcement });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
