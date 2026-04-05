const express = require("express");
const router = express.Router();
const { getGallery, getAllGallery, uploadImage, deleteImage } = require("../controllers/gallery.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", getGallery);
router.get("/all", protect, adminOnly, getAllGallery);
router.post("/", protect, adminOnly, upload.single("image"), uploadImage);
router.delete("/:id", protect, adminOnly, deleteImage);

module.exports = router;
