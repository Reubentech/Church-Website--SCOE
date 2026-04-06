const prisma = require("../lib/prisma");

exports.getBibleStudies = async (req, res) => {
  try {
    const studies = await prisma.bibleStudy.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: studies });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllBibleStudies = async (req, res) => {
  try {
    const studies = await prisma.bibleStudy.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: studies });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createBibleStudy = async (req, res) => {
  try {
    const { title, content, scripture, week, author, isPublished } = req.body;
    const study = await prisma.bibleStudy.create({ data: { title, content, scripture, week, author, isPublished: isPublished !== undefined ? Boolean(isPublished) : true, createdBy: req.user.id } });
    res.status(201).json({ success: true, data: study });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateBibleStudy = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);
    delete data.createdBy;
    const study = await prisma.bibleStudy.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: study });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteBibleStudy = async (req, res) => {
  try {
    await prisma.bibleStudy.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
