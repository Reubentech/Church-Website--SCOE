const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ["news", "testimony", "devotional", "announcement", "teaching"], default: "news" },
  author: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  tags: [String],
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("BlogPost", blogPostSchema);
