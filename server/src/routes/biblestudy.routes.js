const express = require("express");
const router = express.Router();
const { getBibleStudies, getAllBibleStudies, createBibleStudy, updateBibleStudy, deleteBibleStudy } = require("../controllers/biblestudy.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getBibleStudies);
router.get("/all", protect, adminOnly, getAllBibleStudies);
router.post("/", protect, adminOnly, createBibleStudy);
router.put("/:id", protect, adminOnly, updateBibleStudy);
router.delete("/:id", protect, adminOnly, deleteBibleStudy);

module.exports = router;
