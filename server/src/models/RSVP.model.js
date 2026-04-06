const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  eventTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  guests: { type: Number, default: 1 },
  status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
}, { timestamps: true });

module.exports = mongoose.model("RSVP", rsvpSchema);
