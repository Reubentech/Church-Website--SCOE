const mongoose = require("mongoose");

const bulletinSchema = new mongoose.Schema({
  title: { type: String, required: true },
  week: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  announcements: [{ type: String }],
  scripture: { type: String, default: "" },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Bulletin", bulletinSchema);
