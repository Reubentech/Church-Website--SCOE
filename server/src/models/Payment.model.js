const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sermonId: { type: mongoose.Schema.Types.ObjectId, ref: "Sermon", required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  checkoutRequestId: { type: String, default: "" },
  merchantRequestId: { type: String, default: "" },
  mpesaReceiptNumber: { type: String, default: "" },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  resultDesc: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
