const User = require("../models/User.model");
const Event = require("../models/Event.model");
const Sermon = require("../models/Sermon.model");
const Gallery = require("../models/Gallery.model");
const Contact = require("../models/Contact.model");

exports.getAnalytics = async (req, res) => {
  try {
    const [users, events, sermons, gallery, messages, unreadMessages] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Sermon.countDocuments(),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false })
    ]);
    res.json({ success: true, data: { users, events, sermons, gallery, messages, unreadMessages } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
