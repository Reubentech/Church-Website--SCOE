const mongoose = require("mongoose");

const prayerRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: "" },
  request: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  isAnswered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("PrayerRequest", prayerRequestSchema);
