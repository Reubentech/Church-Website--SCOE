const express = require("express");
const router = express.Router();
const { initiateSTKPush, mpesaCallback, checkPaymentStatus, getPayments } = require("../controllers/mpesa.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/stk-push", initiateSTKPush);
router.post("/callback", mpesaCallback);
router.get("/status/:checkoutRequestId", checkPaymentStatus);
router.get("/payments", protect, adminOnly, getPayments);

module.exports = router;
