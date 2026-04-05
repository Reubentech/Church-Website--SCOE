const express = require("express");
const router = express.Router();
const { getLogs, clearLogs } = require("../controllers/activitylog.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
router.get("/", protect, adminOnly, getLogs);
router.delete("/", protect, adminOnly, clearLogs);
module.exports = router;
