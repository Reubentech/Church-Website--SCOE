const axios = require("axios");
const prisma = require("../lib/prisma");
const { getAccessToken, getTimestamp, getPassword } = require("../utils/mpesa.utils");

exports.initiateSTKPush = async (req, res) => {
  try {
    const { phone, sermonId } = req.body;
    if (!phone || !sermonId) return res.status(400).json({ success: false, message: "Phone and sermon ID required" });

    const sermon = await prisma.sermon.findUnique({ where: { id: sermonId } });
    if (!sermon) return res.status(404).json({ success: false, message: "Sermon not found" });
    if (!sermon.isPremium) return res.status(400).json({ success: false, message: "Sermon is not premium" });

    let formattedPhone = phone.replace(/\s/g, "").replace(/^0/, "254").replace(/^\+/, "");
    if (!formattedPhone.startsWith("254")) return res.status(400).json({ success: false, message: "Invalid phone number" });

    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);
    const amount = Math.ceil(sermon.price);

    const stkUrl = process.env.MPESA_ENV === "production"
      ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `SCE-${sermonId.slice(-6).toUpperCase()}`,
      TransactionDesc: `Payment for ${sermon.title}`,
    };

    const response = await axios.post(stkUrl, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const payment = await prisma.payment.create({ data: {
      userId: req.user?.id || null,
      sermonId,
      phone: formattedPhone,
      amount,
      checkoutRequestId: response.data.CheckoutRequestID,
      merchantRequestId: response.data.MerchantRequestID,
      status: "pending",
    }});

    res.json({ success: true, message: "STK Push sent! Check your phone and enter your M-Pesa PIN.", checkoutRequestId: response.data.CheckoutRequestID, paymentId: payment.id });
  } catch (err) {
    console.error("STK Push Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Payment initiation failed. Please try again." });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;
    const payment = await prisma.payment.findFirst({ where: { checkoutRequestId: CheckoutRequestID } });
    if (!payment) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    if (ResultCode === 0) {
      let receiptNumber = "";
      if (CallbackMetadata?.Item) {
        const receiptItem = CallbackMetadata.Item.find(i => i.Name === "MpesaReceiptNumber");
        if (receiptItem) receiptNumber = receiptItem.Value;
      }
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "completed", mpesaReceiptNumber: receiptNumber, resultDesc: ResultDesc } });
    } else {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed", resultDesc: ResultDesc } });
    }
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err.message);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    const payment = await prisma.payment.findFirst({ where: { checkoutRequestId } });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, status: payment.status, receipt: payment.mpesaReceiptNumber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({ include: { sermon: { select: { title: true, price: true } } }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
