const prisma = require("../lib/prisma");

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({ where: { isPublished: true }, orderBy: { date: "asc" } });
    res.json({ success: true, data: events });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
    res.json({ success: true, data: events });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, isPublished } = req.body;
    const event = await prisma.event.create({ data: { title, description, date: new Date(date), time, location, category, isPublished: isPublished !== undefined ? Boolean(isPublished) : true, createdBy: req.user.id } });
    res.status(201).json({ success: true, data: event });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const event = await prisma.event.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: event });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Event deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
