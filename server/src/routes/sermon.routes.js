const express = require("express");
const router = express.Router();
const { getSermons, getAllSermons, createSermon, updateSermon, deleteSermon } = require("../controllers/sermon.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", getSermons);
router.get("/all", protect, adminOnly, getAllSermons);
router.post("/", protect, adminOnly, upload.single("file"), createSermon);
router.put("/:id", protect, adminOnly, upload.single("file"), updateSermon);
router.delete("/:id", protect, adminOnly, deleteSermon);

module.exports = router;
