const mongoose = require("mongoose");
const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, default: "System" },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: String, default: "" },
  details: { type: String, default: "" },
  ip: { type: String, default: "" },
}, { timestamps: true });
module.exports = mongoose.model("ActivityLog", activityLogSchema);
