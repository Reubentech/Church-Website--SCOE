const express = require("express");
const router = express.Router();
const { getEvents, getAllEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/event.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getEvents);
router.get("/all", protect, adminOnly, getAllEvents);
router.post("/", protect, adminOnly, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
