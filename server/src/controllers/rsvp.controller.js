const prisma = require("../lib/prisma");

exports.createRSVP = async (req, res) => {
  try {
    const { eventId, eventTitle, name, email, phone, guests } = req.body;
    if (!eventId || !name || !email) return res.status(400).json({ success: false, message: "eventId, name and email are required" });
    const guestCount = parseInt(guests) || 1;
    if (guestCount < 1 || guestCount > 20) return res.status(400).json({ success: false, message: "Guests must be between 1 and 20" });
    const existing = await prisma.rSVP.findFirst({ where: { eventId, email } });
    if (existing) return res.status(400).json({ success: false, message: "You have already RSVP'd for this event" });
    const rsvp = await prisma.rSVP.create({ data: { eventId, eventTitle, name, email, phone: phone || "", guests: guestCount } });
    res.status(201).json({ success: true, message: "RSVP confirmed successfully!", data: rsvp });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getRSVPs = async (req, res) => {
  try {
    const { eventId } = req.query;
    const rsvps = await prisma.rSVP.findMany({
      where: eventId ? { eventId } : {},
      include: { event: { select: { title: true, date: true, location: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: rsvps });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getRSVPStats = async (req, res) => {
  try {
    const [total, confirmed, cancelled] = await Promise.all([
      prisma.rSVP.count(),
      prisma.rSVP.count({ where: { status: "confirmed" } }),
      prisma.rSVP.count({ where: { status: "cancelled" } }),
    ]);
    const guestsAgg = await prisma.rSVP.aggregate({ _sum: { guests: true } });
    const byEvent = await prisma.rSVP.groupBy({ by: ["eventTitle"], _count: { _all: true }, _sum: { guests: true }, orderBy: { _count: { eventTitle: "desc" } } });
    res.json({ success: true, data: { total, confirmed, cancelled, totalGuests: guestsAgg._sum.guests || 0, byEvent: byEvent.map(e => ({ _id: e.eventTitle, count: e._count._all, guests: e._sum.guests || 0 })) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateRSVPStatus = async (req, res) => {
  try {
    const rsvp = await prisma.rSVP.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json({ success: true, data: rsvp });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteRSVP = async (req, res) => {
  try {
    await prisma.rSVP.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "RSVP deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
