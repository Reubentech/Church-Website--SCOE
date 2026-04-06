const prisma = require("../lib/prisma");

exports.getSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) settings = await prisma.siteSettings.create({ data: {} });
    res.json({ success: true, data: settings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: req.body });
    } else {
      const data = { ...req.body };
      if (data.isLive !== undefined) data.isLive = Boolean(data.isLive);
      settings = await prisma.siteSettings.update({ where: { id: settings.id }, data });
    }
    res.json({ success: true, data: settings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
