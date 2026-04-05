const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/gdrive", protect, adminOnly, async (req, res) => {
  res.json({ success: true, message: "Google Drive import not configured yet." });
});

router.get("/gdrive/status", protect, adminOnly, async (req, res) => {
  const configured = !!process.env.GDRIVE_FOLDER_ID;
  res.json({ success: true, configured, message: configured ? "Google Drive is configured" : "Set GDRIVE_FOLDER_ID in .env to enable" });
});

module.exports = router;
