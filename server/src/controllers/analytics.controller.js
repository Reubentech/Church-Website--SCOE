const prisma = require("../lib/prisma");

exports.getAnalytics = async (req, res) => {
  try {
    const [users, events, sermons, gallery, messages, unreadMessages] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.sermon.count(),
      prisma.gallery.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { isRead: false } }),
    ]);
    res.json({ success: true, data: { users, events, sermons, gallery, messages, unreadMessages } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
