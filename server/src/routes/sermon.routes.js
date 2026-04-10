const express = require("express");
const router = express.Router();
const { getSermons, getAllSermons, createSermon, updateSermon, deleteSermon } = require("../controllers/sermon.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const { uploadSermon } = require("../utils/cloudinary");

router.get("/", getSermons);
router.get("/all", protect, adminOnly, getAllSermons);
router.post("/", protect, adminOnly, uploadSermon.single("file"), createSermon);
router.put("/:id", protect, adminOnly, uploadSermon.single("file"), updateSermon);
router.delete("/:id", protect, adminOnly, deleteSermon);

module.exports = router;
