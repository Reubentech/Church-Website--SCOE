const express = require("express");
const router = express.Router();
const { subscribe, getSubscribers, unsubscribe } = require("../controllers/newsletter.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/subscribe", subscribe);
router.get("/subscribers", protect, adminOnly, getSubscribers);
router.put("/:id/unsubscribe", protect, adminOnly, unsubscribe);

module.exports = router;
