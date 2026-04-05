const express = require("express");
const router = express.Router();
const { getBulletins, getAllBulletins, createBulletin, updateBulletin, deleteBulletin } = require("../controllers/bulletin.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getBulletins);
router.get("/all", protect, adminOnly, getAllBulletins);
router.post("/", protect, adminOnly, createBulletin);
router.put("/:id", protect, adminOnly, updateBulletin);
router.delete("/:id", protect, adminOnly, deleteBulletin);

module.exports = router;
