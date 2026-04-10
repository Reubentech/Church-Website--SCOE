const prisma = require("../utils/prisma");

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
    const { title, description, speaker, date, type, videoLink, isPremium, price } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const sermon = await prisma.sermon.create({
      data: {
        title,
        description,
        speaker,
        date: new Date(date),
        type,
        videoLink: videoLink || null,
        fileUrl: fileUrl || null,
        isPremium: isPremium === "true" || isPremium === true,
        price: parseFloat(price) || 0,
        createdBy: req.user.id,
      }
    });
    res.status(201).json({ success: true, data: sermon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSermon = async (req, res) => {
  try {
    const { title, description, speaker, date, type, videoLink, isPremium, price, isPublished } = req.body;
    const updateData = {
      title, description, speaker, type,
      date: date ? new Date(date) : undefined,
      videoLink: videoLink || null,
      isPremium: isPremium === "true" || isPremium === true,
      price: parseFloat(price) || 0,
      isPublished: isPublished === "true" || isPublished === true,
    };
    if (req.file) updateData.fileUrl = req.file.path;
    const sermon = await prisma.sermon.update({ where: { id: req.params.id }, data: updateData });
    res.json({ success: true, data: sermon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSermon = async (req, res) => {
  try {
    await prisma.sermon.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Sermon deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
