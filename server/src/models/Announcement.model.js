const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "warning", "success"], default: "info" },
  isActive: { type: Boolean, default: true },
  link: { type: String, default: "" },
  linkText: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
