const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: "" },
  author: { type: String, required: true },
  category: { type: String, enum: ["news", "testimony", "devotional", "announcement", "teaching"], default: "news" },
  imageUrl: { type: String, default: "" },
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
