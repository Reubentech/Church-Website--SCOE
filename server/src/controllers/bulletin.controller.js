const prisma = require("../lib/prisma");

exports.getBulletins = async (req, res) => {
  try {
    const bulletins = await prisma.bulletin.findMany({ where: { isPublished: true }, orderBy: { date: "desc" } });
    res.json({ success: true, data: bulletins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllBulletins = async (req, res) => {
  try {
    const bulletins = await prisma.bulletin.findMany({ orderBy: { date: "desc" } });
    res.json({ success: true, data: bulletins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createBulletin = async (req, res) => {
  try {
    const { title, week, date, content, announcements, scripture, isPublished } = req.body;
    const bulletin = await prisma.bulletin.create({ data: { title, week, date: new Date(date), content, announcements: Array.isArray(announcements) ? announcements : [], scripture: scripture || "", isPublished: isPublished !== undefined ? Boolean(isPublished) : true, createdBy: req.user.id } });
    res.status(201).json({ success: true, data: bulletin });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateBulletin = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);
    if (data.announcements && !Array.isArray(data.announcements)) data.announcements = [];
    delete data.createdBy;
    const bulletin = await prisma.bulletin.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: bulletin });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteBulletin = async (req, res) => {
  try {
    await prisma.bulletin.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Bulletin deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
