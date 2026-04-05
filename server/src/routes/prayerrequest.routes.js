const express = require("express");
const router = express.Router();
const { submitPrayerRequest, getPrayerRequests, markAnswered, deletePrayerRequest } = require("../controllers/prayerrequest.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/", submitPrayerRequest);
router.get("/", protect, adminOnly, getPrayerRequests);
router.put("/:id/answered", protect, adminOnly, markAnswered);
router.delete("/:id", protect, adminOnly, deletePrayerRequest);

module.exports = router;
