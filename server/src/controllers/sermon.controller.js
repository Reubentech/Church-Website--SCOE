const prisma = require("../lib/prisma");

exports.getSermons = async (req, res) => {
  try {
    const sermons = await prisma.sermon.findMany({ where: { isPublished: true }, orderBy: { date: "desc" } });
    res.json({ success: true, data: sermons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllSermons = async (req, res) => {
  try {
    const sermons = await prisma.sermon.findMany({ orderBy: { date: "desc" } });
    res.json({ success: true, data: sermons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSermon = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const { title, description, speaker, date, type, videoLink, isPremium, price, isPublished } = req.body;
    const sermon = await prisma.sermon.create({ data: { title, description, speaker, date: new Date(date), type, fileUrl, videoLink: videoLink || "", isPremium: isPremium === "true" || isPremium === true, price: parseFloat(price) || 0, isPublished: isPublished !== undefined ? Boolean(isPublished) : true, createdBy: req.user.id } });
    res.status(201).json({ success: true, data: sermon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSermon = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    if (data.isPremium !== undefined) data.isPremium = data.isPremium === "true" || data.isPremium === true;
    if (data.price !== undefined) data.price = parseFloat(data.price) || 0;
    delete data.createdBy;
    const sermon = await prisma.sermon.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: sermon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSermon = async (req, res) => {
  try {
    await prisma.sermon.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Sermon deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
