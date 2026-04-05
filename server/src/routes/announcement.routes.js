const express = require("express");
const router = express.Router();
const { getActiveAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcement.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getActiveAnnouncements);
router.get("/all", protect, adminOnly, getAllAnnouncements);
router.post("/", protect, adminOnly, createAnnouncement);
router.put("/:id", protect, adminOnly, updateAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;
