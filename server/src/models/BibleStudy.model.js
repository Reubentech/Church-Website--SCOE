const mongoose = require("mongoose");

const bibleStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  scripture: { type: String, required: true },
  week: { type: String, required: true },
  author: { type: String, required: true },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("BibleStudy", bibleStudySchema);
