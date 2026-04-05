const mongoose = require("mongoose");

const sermonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  speaker: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["pdf","audio","video"], required: true },
  fileUrl: { type: String, default: "" },
  videoLink: { type: String, default: "" },
  isPremium: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Sermon", sermonSchema);
