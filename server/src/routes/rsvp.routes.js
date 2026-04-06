const express = require("express");
const router = express.Router();
const { createRSVP, getRSVPs, getRSVPStats, updateRSVPStatus, deleteRSVP } = require("../controllers/rsvp.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/", createRSVP);
router.get("/", protect, adminOnly, getRSVPs);
router.get("/stats", protect, adminOnly, getRSVPStats);
router.put("/:id/status", protect, adminOnly, updateRSVPStatus);
router.delete("/:id", protect, adminOnly, deleteRSVP);

module.exports = router;
