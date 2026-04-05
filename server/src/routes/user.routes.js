const express = require("express");
const router = express.Router();
const { getUsers, createUser, updateUser, updateUserRole, deleteUser, bulkDeleteUsers } = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id", protect, adminOnly, updateUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/bulk", protect, adminOnly, bulkDeleteUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
