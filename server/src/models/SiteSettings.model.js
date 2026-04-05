const mongoose = require("mongoose");
const siteSettingsSchema = new mongoose.Schema({
  churchName: { type: String, default: "Sabbathtarian Church of Elohim" },
  tagline: { type: String, default: "Rooted in Scripture. Devoted to Truth." },
  address: { type: String, default: "Nairobi, Kenya" },
  phone: { type: String, default: "+254 700 000 000" },
  email: { type: String, default: "admin@church.org" },
  facebook: { type: String, default: "" },
  youtube: { type: String, default: "" },
  twitter: { type: String, default: "" },
  instagram: { type: String, default: "" },
  livestreamUrl: { type: String, default: "" },
  isLive: { type: Boolean, default: false },
  welcomeMessage: { type: String, default: "" },
  aboutText: { type: String, default: "" },
}, { timestamps: true });
module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
